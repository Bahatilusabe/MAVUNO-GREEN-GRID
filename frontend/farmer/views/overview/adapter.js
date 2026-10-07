// Maps /api/overview onto the shape the Risk Watch card expects.
export function toRiskModel(api) {
  const topRisk = api?.topRisk;
  if (!topRisk) {
    return { topFarm: null, exposedKg: 0, hoursToWindow: null };
  }

  const crop = api.harvests?.find((harvest) => harvest.id === topRisk.cropId);
  const hoursToWindow = crop?.expectedHarvest
    ? Math.max(
        0,
        Math.round(
          (new Date(`${crop.expectedHarvest}T00:00:00`) - Date.now()) / 36e5
        )
      )
    : null;

  return {
    topFarm: {
      id: topRisk.farmId,
      name: topRisk.farm,
      crop: topRisk.crop,
    },
    exposedKg: topRisk.exposedKg,
    hoursToWindow,
  };
}
