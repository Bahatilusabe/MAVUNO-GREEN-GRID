import { useEffect, useState } from "react";
import { CloudRain, CloudSun, Sun, CloudLightning, MapPin, RefreshCw } from "lucide-react";
import { fetchWeatherForecast } from "../../shared/data";

const WEATHER_ICONS = {
  partlyCloudy: CloudSun,
  rain: CloudRain,
  storm: CloudLightning,
  sunny: Sun,
};

const WEATHER_LABELS = {
  partlyCloudy: "Partly cloudy",
  rain: "Rain",
  storm: "Storm",
  sunny: "Clear sky",
};

const formatForecastDate = (date) => new Intl.DateTimeFormat("en-KE", {
  weekday: "long",
  day: "numeric",
  month: "short",
}).format(new Date(`${date}T12:00:00`));

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchWeatherForecast()
      .then((data) => {
        if (active) setWeather(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      });
    return () => {
      active = false;
    };
  }, []);

  const current = weather?.currentWeather || weather?.forecast?.[0];
  const CurrentIcon = WEATHER_ICONS[weather?.forecast?.[0]?.icon] || CloudSun;
  const currentLabel = WEATHER_LABELS[weather?.forecast?.[0]?.icon] || "Live forecast";

  return (
    <section className="weather-landscape-card">
      <div className="weather-landscape">
        <div className="weather-sky" />
        <div className="weather-sun" />
        <div className="weather-hill weather-hill-one" />
        <div className="weather-hill weather-hill-two" />
        <div className="weather-water">
          <span /><span /><span /><span />
        </div>
        <div className="weather-hill weather-hill-three" />
        <div className="weather-tree weather-tree-one" />
        <div className="weather-tree weather-tree-two" />
        <div className="weather-landscape-overlay" />
      </div>

      <div className="weather-content">
        {error ? (
          <div className="weather-error">
            Live weather is unavailable right now. Please try again later.
          </div>
        ) : !weather ? (
          <div className="weather-loading">
            <RefreshCw size={16} className="animate-spin" /> Loading live forecast…
          </div>
        ) : (
          <>
            <div className="weather-current">
              <div className="weather-condition">
                <div className="weather-icon-bubble"><CurrentIcon size={24} /></div>
                <span>{currentLabel}</span>
              </div>
              <div className="weather-location">
                <div className="flex items-center justify-end gap-1">
                  <MapPin size={14} /> <span>{weather.location || "Kirinyaga"}</span>
                </div>
                <span>{formatForecastDate(weather.forecast?.[0]?.date)}</span>
                <strong>{Math.round(Number(current?.temperatureC ?? 0))}°C</strong>
              </div>
            </div>
            <div className="weather-details">
              <span>{current?.windSpeedKph ? `${Math.round(current.windSpeedKph)} km/h wind` : `${weather.forecast?.[0]?.precipitationProbability ?? 0}% rain`}</span>
              <span>Open-Meteo live data</span>
            </div>
            <div className="weather-forecast">
              {weather.forecast?.slice(1, 4).map(({ date, day, temperatureC, icon }) => {
                const Icon = WEATHER_ICONS[icon] || CloudSun;
                return (
                  <div key={date} className="weather-forecast-day">
                    <span>{day}</span>
                    <Icon size={16} />
                    <strong>{temperatureC}°C</strong>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
