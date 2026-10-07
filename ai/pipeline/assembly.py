import copy
import pandas as pd

from matching.matcher import score_options


def check_choices(facts: dict, out: dict) -> list:
    """Structure check of the model's reply (before we build a full decision)."""
    if not isinstance(out, dict) or not isinstance(out.get("weeks"), list):
        return ["the reply needs a 'weeks' list"]
    problems, got = [], []
    for c in out["weeks"]:
        if not isinstance(c, dict) or not isinstance(c.get("allocations"), list):
            problems.append("each week needs 'week' and an 'allocations' list")
            continue
        wk = c.get("week")
        got.append(wk)
        u = c.get("unallocated_t")
        if not isinstance(u, (int, float)) or isinstance(u, bool):
            problems.append(f"week {wk}: unallocated_t must be a number")
        if not isinstance(c.get("reasoning"), str) or not c["reasoning"].strip():
            problems.append(f"week {wk}: reasoning is empty")
        for a in c["allocations"]:
            if (not isinstance(a, dict) or "option" not in a
                    or not isinstance(a.get("tonnes"), (int, float))
                    or isinstance(a.get("tonnes"), bool)):
                problems.append(f"week {wk}: each allocation needs 'option' and "
                                f"a numeric 'tonnes'")
                break
    expected = {w["week"] for w in facts["decide_weeks"]}
    for wk in sorted(expected - set(got)):
        problems.append(f"week {wk}: missing - decide every week in decide_weeks")
    for wk in sorted(set(got) - expected, key=str):
        problems.append(f"week {wk}: not in decide_weeks, remove it")
    if len(got) != len(set(got)):
        problems.append("a week appears more than once")
    return problems


def _allocate_by_preference(amount: float, available: dict, candidates: list,
                            score_order: list) -> dict:
    """Fit a requested quantity to route capacities, preserving model order."""
    preferred = {}
    for candidate in candidates:
        name = candidate["option"]
        tonnes = candidate["tonnes"]
        if name in available and isinstance(tonnes, (int, float)):
            preferred[name] = preferred.get(name, 0.0) + max(float(tonnes), 0.0)
    order = list(dict.fromkeys(
        [candidate["option"] for candidate in candidates
         if candidate["option"] in available] + score_order))
    allocated = {name: 0.0 for name in available}
    remaining = max(float(amount), 0.0)
    for name in order:
        take = min(preferred.get(name, 0.0), available[name], remaining)
        allocated[name] += take
        available[name] -= take
        remaining -= take
    for name in score_order:
        take = min(available[name], remaining)
        allocated[name] += take
        available[name] -= take
        remaining -= take
        if remaining <= 1e-9:
            break
    return allocated


def assemble(situation: dict, reference: dict, out: dict) -> dict:
    """Apply model route preferences while code enforces quantities and storage."""
    chosen = {c["week"]: c for c in out["weeks"]}
    capacities = {o["name"]: float(o["capacity_t_per_week"])
                  for o in situation["options"]}
    score_order = score_options(pd.DataFrame(situation["options"]))["name"].tolist()
    storage = situation.get("storage")
    storage_capacity = float(storage["capacity_t"]) if storage else 0.0
    max_hold = int(storage["max_hold_weeks"]) if storage else 0
    total_capacity = sum(capacities.values())
    batches = []
    release_reservations = {}
    weeks = []
    warnings = [str(x) for x in out.get("warnings", [])
                if isinstance(out.get("warnings"), list)]
    for index, w in enumerate(reference["weeks"]):
        new = copy.deepcopy(w)
        c = chosen[w["week"]]
        candidates = c["allocations"]
        available = dict(capacities)

        fresh_target = min(float(w["surplus_t"]), sum(available.values()))
        fresh_alloc = _allocate_by_preference(
            fresh_target, available, candidates, score_order)

        requested_release = max(float(c.get("release_t", 0.0)), 0.0)
        stored = sum(batch[1] for batch in batches)
        release_target = min(requested_release, stored, sum(available.values()))
        release_alloc = _allocate_by_preference(
            release_target, available, candidates, score_order)
        release = sum(release_alloc.values())
        left_to_release = release
        for batch in batches:
            take = min(batch[1], left_to_release)
            batch[1] -= take
            left_to_release -= take
        batches = [batch for batch in batches if batch[1] > 1e-9]

        fresh_overflow = max(float(w["surplus_t"]) - fresh_target, 0.0)
        remaining_storage = max(
            storage_capacity - sum(batch[1] for batch in batches), 0.0)
        future_slots = []
        future_release = 0.0
        for future in reference["weeks"][index + 1:]:
            if future["week"] - w["week"] > max_hold:
                continue
            future_capacity = max(
                total_capacity - min(float(future["surplus_t"]), total_capacity),
                0.0)
            requested = max(float(chosen[future["week"]].get("release_t", 0.0)), 0.0)
            reservable = max(
                min(requested, future_capacity)
                - release_reservations.get(future["week"], 0.0),
                0.0)
            future_slots.append((future["week"], reservable))
            future_release += reservable
        store = min(max(float(c.get("store_t", 0.0)), 0.0),
                    fresh_overflow, remaining_storage, future_release)
        to_reserve = store
        for future_week, reservable in future_slots:
            reserved = min(reservable, to_reserve)
            release_reservations[future_week] = (
                release_reservations.get(future_week, 0.0) + reserved)
            to_reserve -= reserved
            if to_reserve <= 1e-9:
                break
        if store > 0:
            batches.append([w["week"], store])

        allocations = {name: fresh_alloc[name] + release_alloc[name]
                       for name in capacities}
        new["allocations"] = [{"option": name, "tonnes": tonnes}
                              for name, tonnes in allocations.items()]
        new["unallocated_t"] = max(fresh_overflow - store, 0.0)
        new["store_t"] = store
        new["release_t"] = release
        new["reasoning"] = c["reasoning"]
        proposed_total = (sum(max(float(a["tonnes"]), 0.0) for a in candidates
                              if isinstance(a.get("tonnes"), (int, float)))
                          + max(float(c.get("store_t", 0.0)), 0.0)
                          + max(float(c.get("unallocated_t", 0.0)), 0.0))
        final_total = (sum(allocations.values()) + store + new["unallocated_t"])
        proposed_allocations = {}
        for allocation in candidates:
            name, tonnes = allocation.get("option"), allocation.get("tonnes")
            if name in capacities and isinstance(tonnes, (int, float)):
                proposed_allocations[name] = (
                    proposed_allocations.get(name, 0.0) + max(float(tonnes), 0.0))
        routes_adjusted = any(
            abs(proposed_allocations.get(name, 0.0) - tonnes) > 0.5
            for name, tonnes in allocations.items())
        if (routes_adjusted or abs(proposed_total - final_total) > 0.5
                or abs(max(float(c.get("store_t", 0.0)), 0.0) - store) > 0.5
                or abs(max(float(c.get("unallocated_t", 0.0)), 0.0)
                       - new["unallocated_t"]) > 0.5
                or abs(max(float(c.get("release_t", 0.0)), 0.0) - release) > 0.5):
            warnings.append(
                f"week {w['week']}: model quantities adjusted to respect supply, "
                "route capacities, and storage limits")
        weeks.append(new)
    return {"weeks": weeks,
            "warnings": warnings}


def compare_to_reference(decision: dict, reference: dict) -> list:
    """Non-blocking notes where the model moved tonnes away from the baseline."""
    notes = []
    ref = {w["week"]: w for w in reference["weeks"]}
    for w in decision["weeks"]:
        mine = {a["option"]: a["tonnes"] for a in w["allocations"]}
        base = {a["option"]: a["tonnes"] for a in ref[w["week"]]["allocations"]}
        diffs = {o: mine.get(o, 0) - base.get(o, 0) for o in set(mine) | set(base)}
        moved = sum(abs(d) for d in diffs.values()) / 2
        if moved > 1:
            o = max(diffs, key=lambda k: abs(diffs[k]))
            notes.append(f"week {w['week']}: moves {moved:.0f} t away from the "
                         f"score-ranked baseline (biggest change: {o} {diffs[o]:+.0f} t)")
    return notes