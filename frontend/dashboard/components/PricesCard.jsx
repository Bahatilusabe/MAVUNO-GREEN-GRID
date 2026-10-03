import { TrendingUp } from "lucide-react";
import { CROP_PRICES } from "../../shared/data";
import { Sparkline } from "../../shared/charts";

export default function PricesCard({ onNavigate }) {
  return (
    <section className="db-card">
      <div className="db-row">
        <h3 className="grow db-heading">
          <TrendingUp aria-hidden="true" size={18} /> Market Prices
        </h3>
        <button className="db-link" onClick={() => onNavigate("market")}>
          Market
        </button>
      </div>
      {CROP_PRICES.map((p) => (
        <div key={p.crop} className="db-price">
          <div className="grow">
            <strong>{p.crop}</strong>
            <small>KES {p.price}/kg</small>
          </div>
          <Sparkline data={p.trend} up={p.delta >= 0} />
          <b className={p.delta >= 0 ? "up" : "down"}>
            {p.delta >= 0 ? "▲" : "▼"} {Math.abs(p.delta)}%
          </b>
        </div>
      ))}
    </section>
  );
}
