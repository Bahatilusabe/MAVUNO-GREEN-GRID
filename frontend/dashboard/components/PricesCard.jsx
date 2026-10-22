import { ArrowRight, TrendingUp } from "lucide-react";
import { CROP_PRICES } from "../../shared/data";
import { Sparkline } from "../../shared/charts";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Button from "../../shared/ui/Button";

/**
 * Market prices. The sparkline and the delta badge are the shared chart
 * components, so the trend reads the same as in the market view.
 */
export default function PricesCard({ onNavigate }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <TrendingUp size={18} />
          </span>
          <div className="min-w-0">
            <CardTitle>Market prices</CardTitle>
            <CardSubtitle>What buyers are paying this week</CardSubtitle>
          </div>
        </div>

        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => onNavigate("market")}>
          Market
        </Button>
      </CardHeader>

      <CardBody className="space-y-2.5">
        {CROP_PRICES.map((p) => {
          const isUp = p.delta >= 0;

          return (
            <div
              key={p.crop}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors duration-200 hover:border-brand-200 hover:bg-brand-50/40"
            >
              <div className="min-w-0">
                <strong className="block truncate text-sm font-bold text-foreground">{p.crop}</strong>
                <small className="block text-[11px] font-medium text-muted-foreground">
                  KES {p.price}/kg
                </small>
              </div>

              <div className="flex flex-none items-center gap-2.5">
                <Sparkline data={p.trend} up={isUp} />
                <span
                  className={`rounded-lg px-1.5 py-0.5 text-[11px] font-bold tabular ${
                    isUp ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {isUp ? "▲" : "▼"} {Math.abs(p.delta)}%
                </span>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
