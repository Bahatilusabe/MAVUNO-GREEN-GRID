"""
KIFARU core logic, step 5: impact metrics from an allocation.
Needs: pandas.  Run:  python impact.py

Turns "how many tonnes went where" into the numbers the Impact Dashboard
and a green-finance case would show: tonnes saved, revenue, CO2e avoided.

!! Prices and CO2e factors are SYNTHETIC PLACEHOLDERS. Do NOT quote the
   CO2e results to investors until the factors come from a real source.
"""
import pandas as pd

# Result of allocating 400 t (copied from step 4). Each row also carries the
# option's type, price and CO2e factor from step 3.
ALLOCATION = pd.DataFrame([
    # name,                 type,         allocated_t, price_kes_kg, co2e_per_t
    ("Cold store (Mwea)",   "cold_store",  60, 30, 1300),
    ("Local town markets",  "buyer",       80, 25, 1500),
    ("Nairobi wholesale",   "buyer",      150, 40, 1500),
    ("Solar dryer coop",    "processor",   30, 12, 1100),
    ("Animal feed",         "recovery",    40,  3,  400),
    ("Tomato paste factory", "processor",  40, 18, 1200),
    ("Compost",             "recovery",     0,  1,  150),
], columns=["name", "type", "allocated_t", "price_kes_kg", "co2e_per_t"])

KG_PER_TONNE = 1000
RECOVERY_TYPES = {"recovery"}          # lower-value routes (feed, compost)


def impact_summary(allocation: pd.DataFrame, surplus_t: float) -> dict:
    """Return plain numbers (easy to turn into JSON for the frontend)."""
    a = allocation
    saved_t = a.allocated_t.sum()
    revenue = (a.allocated_t * KG_PER_TONNE * a.price_kes_kg).sum()
    co2e_kg = (a.allocated_t * a.co2e_per_t).sum()
    recovery_t = a[a.type.isin(RECOVERY_TYPES)].allocated_t.sum()
    return {
        "surplus_t": surplus_t,
        "tonnes_saved": saved_t,
        "tonnes_wasted": surplus_t - saved_t,
        "share_saved": saved_t / surplus_t if surplus_t else 0.0,
        "tonnes_as_food_or_product": saved_t - recovery_t,
        "tonnes_as_recovery": recovery_t,
        "revenue_kes": revenue,
        "co2e_avoided_t": co2e_kg / KG_PER_TONNE,
    }


if __name__ == "__main__":
    summary = impact_summary(ALLOCATION, surplus_t=400)
    for key, value in summary.items():
        print(f"{key:28s} {value:>14,.2f}")

    # --- tiny self-checks ---
    assert summary["tonnes_saved"] <= summary["surplus_t"]
    assert abs(summary["tonnes_saved"] + summary["tonnes_wasted"]
               - summary["surplus_t"]) < 1e-9
    assert (abs(summary["tonnes_as_food_or_product"]
                + summary["tonnes_as_recovery"] - summary["tonnes_saved"]) < 1e-9)
    assert 0 <= summary["share_saved"] <= 1
    # Nothing allocated -> nothing saved, no revenue, no CO2e.
    empty = impact_summary(ALLOCATION.assign(allocated_t=0), surplus_t=400)
    assert empty["tonnes_saved"] == 0 and empty["revenue_kes"] == 0
    print("\nAll checks passed.")