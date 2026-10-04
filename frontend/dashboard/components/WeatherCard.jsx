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
    <section className="db-card">
      <h3 className="db-heading">
        <CloudSun aria-hidden="true" size={18} /> Weather
      </h3>
      <div className="db-weather">
        {WEATHER.map(([d, icon, c]) => {
          const Icon = WEATHER_ICONS[icon] || CloudSun;
          return (
            <div key={d}>
              <small>{d}</small>
              <span>
                <Icon aria-hidden="true" size={20} />
              </span>
              <b>{c}°</b>
            </div>
          );
        })}
      </div>
      <small>Sample data. Connect a weather API.</small>
    </section>
  );
}
