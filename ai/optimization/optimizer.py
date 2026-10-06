import pandas as pd

def allocate(surplus_t: float, ranked: pd.DataFrame) -> pd.DataFrame:
    """Fill options in order of score. Returns the table with allocated_t,
    and stores any tonnes nobody could take in df.attrs['unallocated_t']."""
    df = ranked.sort_values("score", ascending=False).reset_index(drop=True)
    remaining = surplus_t
    given = []
    for cap in df.capacity_t:
        take = min(remaining, cap)
        given.append(take)
        remaining -= take
    df["allocated_t"] = given
    df.attrs["unallocated_t"] = remaining
    return df