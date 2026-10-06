import { useEffect, useState } from "react";
import { CloudRain, CloudSun, Sun, CloudLightning, RefreshCw } from "lucide-react";
import { fetchWeatherForecast } from "../../shared/data";

const WEATHER_ICONS = {
  partlyCloudy: CloudSun,
  rain: CloudRain,
  storm: CloudLightning,
  sunny: Sun,
};

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

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="border-b border-gray-100 pb-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
          <CloudSun aria-hidden="true" size={18} className="text-green-600" /> Weather Forecast
        </h3>
      </div>

      {/* Weather Grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {weather?.forecast?.map(({ day, icon, temperatureC, precipitationProbability }) => {
          const Icon = WEATHER_ICONS[icon] || CloudSun;
          return (
            <div 
              key={day}
              className="bg-gray-50/70 border border-gray-100 p-3 rounded-xl flex flex-col items-center justify-center space-y-2 text-center hover:bg-green-50/40 transition-colors"
            >
              <small className="text-[11px] font-semibold text-gray-500">{day}</small>
              <div className="p-2 bg-green-100 text-green-700 rounded-lg shadow-2xs">
                <Icon aria-hidden="true" size={20} />
              </div>
              <strong className="text-sm font-bold text-gray-900">{temperatureC}°</strong>
              <span className="text-[10px] text-gray-500">{precipitationProbability}% rain</span>
            </div>
          );
        })}
        {!weather && !error && (
          <div className="col-span-4 flex items-center justify-center gap-2 py-8 text-xs text-gray-500">
            <RefreshCw size={14} className="animate-spin" /> Loading live forecast…
          </div>
        )}
        {error && (
          <div className="col-span-4 py-6 text-center text-xs text-red-600">
            Live weather is unavailable right now. Please try again later.
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-1">
        <small className="text-[11px] text-gray-400 font-medium">
          {weather ? `${weather.location} · Live OpenWeather data` : "Live weather forecast"}
        </small>
      </div>
    </section>
  );
}