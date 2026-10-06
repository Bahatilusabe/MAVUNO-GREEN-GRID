import { useState } from "react";
import { Check, Factory, Store, TrendingUp, BarChart3, Users, ArrowRight } from "lucide-react";
import { BUYERS, MARKET_PRICES, PRICE_TREND } from "../../shared/data";
import { TrendLine } from "../../shared/charts";
import { COLORS } from "../../shared/chartColors";

const DEMAND_BADGE = {
  High: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-gray-100 text-gray-700 border-gray-200",
};

const SERIES = [
  { key: "nairobi", name: "Nairobi Fresh Markets", color: COLORS.green },
  { key: "kagio", name: "Kagio Processors", color: COLORS.blue },
  { key: "nakuru", name: "Nakuru Market", color: COLORS.amber },
];

const BUYER_ICONS = {
  "Nairobi Fresh Markets": Store,
  "Kagio Juice Processors": Factory,
};

export default function Market() {
  const [tab, setTab] = useState("Market Prices");
  const [routes, setRoutes] = useState({});

  const tabs = ["Market Prices", "Buyers", "Demand Trends"];

  return (
    <div className="space-y-6 pb-12">
      {/* Tabs Bar */}
      <div className="flex border-b border-gray-200 gap-8">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === t 
                ? "border-green-700 text-green-800" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Demand Trends" ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
              <TrendingUp aria-hidden="true" size={20} className="text-green-600" /> Tomato price trend (KES/kg)
            </h3>
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
              Analytics
            </span>
          </div>
          <div className="pt-2">
            <TrendLine data={PRICE_TREND} xKey="week" series={SERIES} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {tab === "Market Prices" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
                  <BarChart3 className="text-green-600" size={20} /> Current Market Prices (Tomatoes)
                </h3>
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                  Live Rates
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4 sm:px-6">Market</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Demand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {MARKET_PRICES.map(([m, p, d]) => (
                      <tr key={m} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900">{m}</td>
                        <td className="py-3.5 px-4 font-bold text-green-800">{p}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${DEMAND_BADGE[d] || "bg-gray-100 text-gray-700"}`}>
                            {d}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Buyers Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-green-600" /> Top Buyers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUYERS.map((b) => {
                const Icon = BUYER_ICONS[b.name] || Store;
                const isOptimized = routes[b.name];

                return (
                  <div key={b.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0">
                          <Icon aria-hidden="true" size={20} />
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-base font-bold text-gray-900 truncate">{b.name}</strong>
                          <small className="text-xs text-gray-500 block mt-0.5">{b.sub}</small>
                        </div>
                      </div>

                      <div className="space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                        <div className="flex justify-between text-gray-700 font-medium">
                          <span className="text-gray-400">Capacity:</span>
                          <span>{b.cap}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 font-medium">
                          <span className="text-gray-400">Offering:</span>
                          <span className="font-semibold text-green-800">{b.price}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs ${
                        isOptimized
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-green-700 hover:bg-green-800 text-white"
                      }`}
                      onClick={() => setRoutes({ ...routes, [b.name]: true })}
                    >
                      {isOptimized ? (
                        <>
                          Route optimized <Check aria-hidden="true" size={16} />
                        </>
                      ) : (
                        <>
                          Optimize Route <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}