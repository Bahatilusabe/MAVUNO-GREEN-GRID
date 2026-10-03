import { useState } from "react";
import { Check, Factory, Store, TrendingUp } from "lucide-react";
import { BUYERS, MARKET_PRICES, PRICE_TREND } from "../../shared/data";
import { TrendLine, COLORS } from "../../shared/charts";
import { cls } from "../../shared/utils";
import { Tabs } from "../components/ui";

const DEMAND_PILL = {
  High: "pill-high-demand",
  Medium: "pill-medium",
  Low: "pill-low",
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

  return (
    <>
      <Tabs
        tabs={["Market Prices", "Buyers", "Demand Trends"]}
        active={tab}
        onChange={setTab}
      />

      {tab === "Demand Trends" ? (
        <div className="card">
          <h3>
            <TrendingUp aria-hidden="true" size={18} /> Tomato price trend
            (KES/kg)
          </h3>
          <TrendLine data={PRICE_TREND} xKey="week" series={SERIES} />
        </div>
      ) : (
        <>
          {tab === "Market Prices" && (
            <div className="card">
              <div className="row">
                <h3 className="grow">Current Market Prices (Tomatoes)</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Price</th>
                    <th>Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKET_PRICES.map(([m, p, d]) => (
                    <tr key={m}>
                      <td>{m}</td>
                      <td>{p}</td>
                      <td>
                        <span className={cls("pill", DEMAND_PILL[d])}>{d}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <h3>Top Buyers</h3>
          <div className="buyer-grid">
            {BUYERS.map((b) => (
              <div key={b.name} className="card buyer">
                <div className="row">
                  <span className="row-icon">
                    {(() => {
                      const Icon = BUYER_ICONS[b.name] || Store;
                      return <Icon aria-hidden="true" size={18} />;
                    })()}
                  </span>
                  <div>
                    <strong>{b.name}</strong>
                    <small>{b.sub}</small>
                  </div>
                </div>
                <small>{b.cap}</small>
                <small>{b.price}</small>
                <button
                  className={cls("btn", routes[b.name] && "btn-done")}
                  onClick={() => setRoutes({ ...routes, [b.name]: true })}
                >
                  {routes[b.name] ? (
                    <>
                      Route optimized <Check aria-hidden="true" size={16} />
                    </>
                  ) : (
                    "Optimize Route"
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
