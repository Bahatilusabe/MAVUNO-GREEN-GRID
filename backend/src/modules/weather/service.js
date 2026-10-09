const OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const DEFAULT_TIME_ZONE = "Africa/Nairobi";

const FETCH_TIMEOUT_MS = Number(process.env.WEATHER_TIMEOUT_MS ?? 15_000);
const CACHE_TTL_MS = 10 * 60 * 1000; // serve cached forecast for 10 min
const STALE_MAX_MS = 6 * 60 * 60 * 1000; // serve stale forecast for up to 6 h if the provider is down
const cache = new Map();

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

const cacheKey = (lat, lon) => `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFromProvider(params) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(`${OPENWEATHER_FORECAST_URL}?${params}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { Accept: "application/json" },
        method: "GET",
      });

      if (response.ok) return await response.json();

      // 4xx other than rate limiting will not improve on retry
      const error = new Error(`OpenWeather returned HTTP ${response.status}`);
      error.statusCode = response.status === 401 ? 502 : 503;
      if (response.status < 500 && response.status !== 429) throw error;
      lastError = error;
    } catch (cause) {
      if (cause.statusCode) throw cause;
      lastError = new Error("Unable to reach the weather provider", { cause });
      lastError.statusCode = 503;
    }
    if (attempt < 2) await sleep(500);
  }
  throw lastError;
}

function buildForecast(data) {
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

export async function getForecast({ lat, lon }) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENWEATHER_API_KEY is not configured");
    error.statusCode = 503;
    throw error;
  }

  const key = cacheKey(lat, lon);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey,
    units: "metric",
  });

  try {
    const value = buildForecast(await fetchFromProvider(params));
    cache.set(key, { at: Date.now(), value });
    return value;
  } catch (error) {
    // Provider down: serve the last good forecast instead of failing the dashboard
    if (cached && Date.now() - cached.at < STALE_MAX_MS) {
      console.warn("Weather provider unavailable, serving cached forecast:", error.message);
      return { ...cached.value, stale: true };
    }
    throw error;
  }
}