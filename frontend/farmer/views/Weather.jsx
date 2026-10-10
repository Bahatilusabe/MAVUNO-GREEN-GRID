import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  RefreshCw,
  Sun,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { fetchWeatherForecast } from "../../shared/data";
import { TrendLine } from "../../shared/charts";
import { COLORS } from "../../shared/chartColors";

const ICONS = {
  partlyCloudy: CloudSun,
  rain: CloudRain,
  storm: AlertTriangle,
  sunny: Sun,
};

const LABELS = {
  partlyCloudy: "Partly cloudy",
  rain: "Rain expected",
  storm: "Storm risk",
  sunny: "Clear skies",
};

function buildPrediction(forecast) {
  const rainyDays = forecast.filter((day) => day.precipitationProbability >= 50);
  const hottest = forecast.reduce((max, day) => day.temperatureC > max.temperatureC ? day : max, forecast[0]);

  if (rainyDays.length) {
    return {
      tone: "blue",
      title: "Rain window detected",
      text: `${rainyDays[0].day} has a ${rainyDays[0].precipitationProbability}% chance of rain. Delay irrigation and check drainage around your crops.`,
    };
  }
  if (hottest?.temperatureC >= 30) {
    return {
      tone: "amber",
      title: "Heat stress possible",
      text: `${hottest.day} may reach ${hottest.temperatureC}°C. Plan early-morning irrigation and inspect crops for wilting.`,
    };
  }
  return {
    tone: "green",
    title: "Favourable field conditions",
    text: "The incoming days look relatively stable. This is a good window for field scouting, crop work, and harvest preparation.",
  };
}

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = () => {
    setRefreshing(true);
    setError(null);
    fetchWeatherForecast()
      .then(setWeather)
      .catch(setError)
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    load();
  }, []);

  const forecast = weather?.forecast || [];
  const prediction = buildPrediction(forecast);
  const chartData = forecast.map((day) => ({
    day: day.day,
    temperature: day.temperatureC,
    rain: day.precipitationProbability,
  }));

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-10 text-center space-y-3">
        <AlertTriangle className="mx-auto text-red-600" size={30} />
        <h2 className="font-bold text-gray-900">Weather data is unavailable</h2>
        <p className="text-sm text-gray-500">We could not load the forecast for your farms.</p>
        <button onClick={load} className="px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-semibold hover:bg-green-800">Try again</button>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center gap-2 text-sm text-gray-500">
        <RefreshCw size={17} className="animate-spin" /> Loading weather analytics…
      </div>
    );
  }

  const current = weather.currentWeather || {};
  const today = forecast[0] || {};
  const CurrentIcon = ICONS[today.icon] || CloudSun;
  const stats = [
    { label: "Current temperature", value: `${Math.round(current.temperatureC ?? today.temperatureC ?? 0)}°C`, icon: ThermometerSun, tone: "orange" },
    { label: "Rain probability today", value: `${today.precipitationProbability ?? 0}%`, icon: Droplets, tone: "blue" },
    { label: "Wind speed", value: `${Math.round(current.windSpeedKph ?? 0)} km/h`, icon: Wind, tone: "green" },
    { label: "Forecast confidence", value: "High", icon: Gauge, tone: "purple" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-950">Weather intelligence</h2>
          <p className="text-sm text-gray-500 mt-1">Forecasts and field predictions for {weather.location || "your farms"}.</p>
        </div>
        <button onClick={load} disabled={refreshing} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-green-300 disabled:opacity-60">
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh forecast
        </button>
      </div>

      <section className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/15"><CurrentIcon size={34} /></div>
          <div>
            <p className="text-sm text-green-100">{LABELS[today.icon] || "Live conditions"} · Today</p>
            <strong className="text-4xl tracking-tight">{Math.round(current.temperatureC ?? today.temperatureC ?? 0)}°C</strong>
          </div>
        </div>
        <div className="text-sm text-green-50 sm:text-right space-y-1">
          <p>{weather.location || "Kirinyaga"} · {weather.country || "KE"}</p>
          <p>{today.precipitationProbability ?? 0}% chance of rain · {Math.round(current.windSpeedKph ?? 0)} km/h wind</p>
          <p className="text-xs text-green-200">Source: Open-Meteo{weather.stale ? " · cached forecast" : ""}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-3">
            <div className={`p-3 rounded-xl ${tone === "blue" ? "bg-blue-100 text-blue-700" : tone === "orange" ? "bg-orange-100 text-orange-700" : tone === "purple" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
              <Icon size={20} />
            </div>
            <div><span className="block text-xs text-gray-500">{label}</span><strong className="text-lg text-gray-900">{value}</strong></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div><h3 className="font-bold text-gray-900">Incoming forecast</h3><p className="text-xs text-gray-500 mt-1">Temperature and rain probability for the next five days.</p></div>
            <CloudSun className="text-green-600" size={22} />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
            {forecast.map((day) => {
              const Icon = ICONS[day.icon] || CloudSun;
              return <div key={day.date} className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-center space-y-1"><span className="block text-xs font-semibold text-gray-500">{day.day}</span><Icon className="mx-auto text-green-700" size={20} /><strong className="block text-sm text-gray-900">{day.temperatureC}°C</strong><span className="block text-[11px] text-blue-700">{day.precipitationProbability}% rain</span></div>;
            })}
          </div>
          <div className="mt-5"><TrendLine data={chartData} xKey="day" series={[{ key: "temperature", name: "Temperature °C", color: COLORS.green }, { key: "rain", name: "Rain probability %", color: COLORS.blue }]} /></div>
        </section>

        <section className={`lg:col-span-5 rounded-xl border p-5 ${prediction.tone === "blue" ? "bg-blue-50 border-blue-200" : prediction.tone === "amber" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><ThermometerSun size={19} className="text-green-700" /> Farm prediction</h3>
          <div className="mt-5 space-y-4">
            <div><span className="text-xs font-semibold uppercase tracking-wide text-gray-500">AI-assisted outlook</span><h4 className="text-xl font-bold text-gray-900 mt-1">{prediction.title}</h4></div>
            <p className="text-sm leading-relaxed text-gray-700">{prediction.text}</p>
            <div className="pt-4 border-t border-black/10 space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2"><Droplets size={15} className="text-blue-600" /> Plan irrigation around rain windows.</p>
              <p className="flex items-center gap-2"><Sun size={15} className="text-amber-600" /> Schedule field work during cooler hours.</p>
              <p className="flex items-center gap-2"><CloudRain size={15} className="text-green-700" /> Recheck storage and transport if rain risk rises.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
