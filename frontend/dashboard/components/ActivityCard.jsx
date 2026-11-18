import {
  Bell,
  Cherry,
  CloudSun,
  Droplets,
  Handshake,
  ShieldCheck,
  Tag,
  Tractor,
  TrendingUp,
  Truck,
  Warehouse,
} from "lucide-react";
import { ACTIVITY } from "../data";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import { toActivityRows } from "../model";

/** The icon names the platform's notification feed uses. */
const LIVE_ICONS = {
  risk: TrendingUp,
  deal: Handshake,
  truck: Truck,
  storage: Warehouse,
  price: Tag,
  weather: CloudSun,
  shield: ShieldCheck,
  default: Bell,
};

/** The icon names the sample activity feed uses. */
const SAMPLE_ICONS = {
  tomato: Cherry,
  forecast: TrendingUp,
  water: Droplets,
  farm: Tractor,
};

/**
 * Recent activity.
 *
 * When the farmer is signed in this is the platform's own feed, so a match
 * being accepted shows up here. Otherwise the sample timeline is shown.
 */
export default function ActivityCard({ activity }) {
  const liveRows = toActivityRows(activity);
  const rows = liveRows
    ? liveRows.map((r) => ({
        key: r.key,
        title: r.title,
        when: r.when,
        Icon: LIVE_ICONS[r.tone] ?? LIVE_ICONS.default,
        danger: r.danger,
      }))
    : ACTIVITY.map(([icon, text, when]) => ({
        key: text,
        title: text,
        when,
        Icon: SAMPLE_ICONS[icon] ?? TrendingUp,
        danger: false,
      }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>Recent activity</CardTitle>
          <CardSubtitle>
            {liveRows ? "Your feed on the Green Grid" : "Sample activity on the Green Grid"}
          </CardSubtitle>
        </div>
      </CardHeader>

      <CardBody className="space-y-2">
        {rows.length === 0 && (
          <p className="py-6 text-center text-xs font-medium text-muted-foreground">
            Nothing has happened yet.
          </p>
        )}

        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors duration-200 hover:border-brand-200 hover:bg-brand-50/40"
          >
            <span
              className={`grid h-8 w-8 flex-none place-items-center rounded-lg ${
                row.danger ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-700"
              }`}
              aria-hidden="true"
            >
              <row.Icon size={15} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold leading-snug text-foreground">
                {row.title}
              </p>
              {row.when && (
                <small className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                  {row.when}
                </small>
              )}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
