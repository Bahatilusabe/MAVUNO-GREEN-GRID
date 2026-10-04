"""
KIFARU core logic, step 4: allocate surplus tonnes to ranked options.
Needs: pandas.  Run:  python allocation.py

Method (greedy): go down the list from best score to worst and give each
option as many tonnes as it can take, until the surplus is used up.

!! Scores below are copied from step 3's output; capacities are SYNTHETIC.
   Later we will feed in the real output of step 3 instead.
"""
import pandas as pd

# Ranked options (best first) with how many tonnes each can take this week.
RANKED = pd.DataFrame([
    ("Cold store (Mwea)",     0.86,  60),
    ("Local town markets",    0.84,  80),
    ("Nairobi wholesale",     0.70, 150),
    ("Solar dryer coop",      0.58,  30),
    ("Animal feed",           0.45,  40),
    ("Tomato paste factory",  0.44, 100),
    ("Compost",               0.43,  50),
], columns=["name", "score", "capacity_t"])


def allocate(surplus_t: float, ranked: pd.DataFrame) -> pd.DataFrame:
    """Fill options in order of score. Returns the table with allocated_t,
    and stores any tonnes nobody could take in df.attrs['unallocated_t']."""
    df = ranked.sort_values("score", ascending=False).reset_index(drop=True)
    remaining = surplus_t
    given = []
    for cap in df.capacity_t:
        take = min(remaining, cap)      # never exceed capacity or what is left
        given.append(take)
        remaining -= take
    df["allocated_t"] = given
    df.attrs["unallocated_t"] = remaining
    return df


if __name__ == "__main__":
    for surplus in (400, 1000):         # one case that fits, one that doesn't
        result = allocate(surplus, RANKED)
        left = result.attrs["unallocated_t"]
        print(f"\nSurplus: {surplus} t")
        print(result[["name", "capacity_t", "allocated_t"]].to_string(index=False))
        print(f"Unallocated (at risk of being wasted): {left:.0f} t")

        # --- tiny self-checks ---
        assert (result.allocated_t <= result.capacity_t).all(), "over capacity"
        assert abs(result.allocated_t.sum() + left - surplus) < 1e-9, "tonnes lost"
        assert left >= 0
    print("\nAll checks passed.")