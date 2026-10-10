const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const DEFAULT_TIME_ZONE = "Africa/Nairobi";

const FETCH_TIMEOUT_MS = Number(process.env.WEATHER_TIMEOUT_MS ?? 15_000);
const CACHE_TTL_MS = 10 * 60 * 1000;
const STALE_MAX_MS = 6 * 60 * 60 * 1000;
const cache = new Map();

const weatherIcon = (code) => {
  const value = Number(code);
  if ([95, 96, 99].includes(value)) return "storm";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(value)) return "rain";
  if ([1, 2].includes(value)) return "partlyCloudy";
  return "sunny";
};

const weatherDescription = (code) => {
  const value = Number(code);
  if ([95, 96, 99].includes(value)) return "Thunderstorms";
  if ([51, 53, 55, 56, 57].includes(value)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(value)) return "Rain";
  if ([1, 2].includes(value)) return "Partly cloudy";
  if (value === 3) return "Overcast";
  if (value === 45 || value === 48) return "Fog";
  return "Clear sky";
};

const formatDay = (date, index) => {
  if (index === 0) return "Today";
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    timeZone: DEFAULT_TIME_ZONE,
  }).format(date);
};

const cacheKey = (latitude, longitude) => (
  `${Number(latitude).toFixed(2)},${Number(longitude).toFixed(2)}`
);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchFromProvider(params) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(`${OPEN_METEO_FORECAST_URL}?${params}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { Accept: "application/json" },
        method: "GET",
      });

      if (response.ok) return await response.json();

      const error = new Error(`Open-Meteo returned HTTP ${response.status}`);
      error.statusCode = response.status >= 500 || response.status === 429 ? 503 : 502;
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
  const daily = data.daily ?? {};
  const dates = daily.time ?? [];
  const temperatures = daily.temperature_2m_max ?? [];
  const precipitation = daily.precipitation_probability_max ?? [];
  const codes = daily.weather_code ?? [];

  const forecast = dates.slice(0, 5).map((date, index) => ({
    day: formatDay(new Date(`${date}T12:00:00`), index),
    date,
    temperatureC: Math.round(Number(temperatures[index] ?? 0)),
    precipitationProbability: Math.round(Number(precipitation[index] ?? 0)),
    icon: weatherIcon(codes[index]),
    description: weatherDescription(codes[index]),
  }));

  return {
    location: "Kirinyaga",
    country: "KE",
    currentWeather: data.current_weather
      ? {
          temperatureC: Number(data.current_weather.temperature),
          windSpeedKph: Number(data.current_weather.windspeed),
          weatherCode: data.current_weather.weathercode,
        }
      : null,
    forecast,
    source: "open-meteo",
    updatedAt: new Date().toISOString(),
  };
}

export async function getForecast({ latitude, longitude }) {
  const key = cacheKey(latitude, longitude);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current_weather: "true",
    daily: "temperature_2m_max,precipitation_probability_max,weather_code",
    timezone: DEFAULT_TIME_ZONE,
    forecast_days: "5",
  });

  try {
    const value = buildForecast(await fetchFromProvider(params));
    cache.set(key, { at: Date.now(), value });
    return value;
  } catch (error) {
    if (cached && Date.now() - cached.at < STALE_MAX_MS) {
      console.warn("Weather provider unavailable, serving cached forecast:", error.message);
      return { ...cached.value, stale: true };
    }
    throw error;
  }
}
