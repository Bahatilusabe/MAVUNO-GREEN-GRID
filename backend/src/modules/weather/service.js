const OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const DEFAULT_TIME_ZONE = "Africa/Nairobi";

const weatherIcon = (condition) => {
  const main = condition.toLowerCase();
  if (main.includes("thunderstorm")) return "storm";
  if (main.includes("rain") || main.includes("drizzle")) return "rain";
  if (main.includes("cloud")) return "partlyCloudy";
  return "sunny";
};

const formatDay = (date, index) => {
  if (index === 0) return "Today";
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    timeZone: DEFAULT_TIME_ZONE,
  }).format(date);
};

const localDate = (timestamp) => new Intl.DateTimeFormat("en-CA", {
  timeZone: DEFAULT_TIME_ZONE,
}).format(new Date(timestamp * 1000));

export async function getForecast({ lat, lon }) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENWEATHER_API_KEY is not configured");
    error.statusCode = 503;
    throw error;
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey,
    units: "metric",
  });
  let response;
  try {
    response = await fetch(`${OPENWEATHER_FORECAST_URL}?${params}`, {
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json" },
      method: "GET",
    });
  } catch (cause) {
    const error = new Error("Unable to reach the weather provider", { cause });
    error.statusCode = 503;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`OpenWeather returned HTTP ${response.status}`);
    error.statusCode = response.status === 401 ? 502 : 503;
    throw error;
  }

  const data = await response.json();
  const byDate = new Map();
  for (const item of data.list ?? []) {
    const date = localDate(item.dt);
    const existing = byDate.get(date) ?? {
      date,
      temperatureC: Number(item.main?.temp ?? 0),
      precipitationProbability: 0,
      icon: weatherIcon(item.weather?.[0]?.main ?? ""),
      description: item.weather?.[0]?.description ?? "Unavailable",
      timestamp: item.dt,
    };
    existing.temperatureC = Math.max(existing.temperatureC, Number(item.main?.temp ?? 0));
    existing.precipitationProbability = Math.max(
      existing.precipitationProbability,
      Math.round(Number(item.pop ?? 0) * 100),
    );
    byDate.set(date, existing);
  }

  const forecast = [...byDate.values()].slice(0, 5).map((item, index) => ({
    day: formatDay(new Date(item.timestamp * 1000), index),
    date: item.date,
    temperatureC: Math.round(item.temperatureC),
    precipitationProbability: item.precipitationProbability,
    icon: item.icon,
    description: item.description,
  }));

  return {
    location: data.city?.name ?? "Kirinyaga",
    country: data.city?.country ?? "KE",
    forecast,
    source: "openweather",
    updatedAt: new Date().toISOString(),
  };
}
