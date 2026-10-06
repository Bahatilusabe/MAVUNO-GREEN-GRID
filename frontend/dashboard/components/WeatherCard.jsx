import { CloudRain, CloudSun, CloudSunRain, Sun } from "lucide-react";
import { WEATHER } from "../data";

const WEATHER_ICONS = {
  partlyCloudy: CloudSun,
  showers: CloudSunRain,
  rain: CloudRain,
  sunny: Sun,
};

export default function WeatherCard() {
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
        {WEATHER.map(([d, icon, c]) => {
          const Icon = WEATHER_ICONS[icon] || CloudSun;
          return (
            <div 
              key={d} 
              className="bg-gray-50/70 border border-gray-100 p-3 rounded-xl flex flex-col items-center justify-center space-y-2 text-center hover:bg-green-50/40 transition-colors"
            >
              <small className="text-[11px] font-semibold text-gray-500">{d}</small>
              <div className="p-2 bg-green-100 text-green-700 rounded-lg shadow-2xs">
                <Icon aria-hidden="true" size={20} />
              </div>
              <strong className="text-sm font-bold text-gray-900">{c}°</strong>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-1">
        <small className="text-[11px] text-gray-400 font-medium">Sample data • Connect a weather API</small>
      </div>
    </section>
  );
}