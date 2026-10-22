import { ArrowRight, Cherry, Leaf, Sprout, Wheat } from "lucide-react";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import Progress from "../../shared/ui/Progress";
import EmptyState from "../../shared/ui/EmptyState";
import { riskTone } from "../../shared/status";

const CROP_ICONS = {
  Tomatoes: Cherry,
  "French Beans": Sprout,
  Beans: Sprout,
  Kale: Sprout,
  Cabbage: Leaf,
  Rice: Wheat,
  Maize: Wheat,
  Onions: Leaf,
  Potatoes: Leaf,
};

const CROP_TONES = {
  Tomatoes: "bg-amber-50 text-amber-700 border-amber-200",
  "French Beans": "bg-brand-50 text-brand-700 border-brand-200",
  Beans: "bg-brand-50 text-brand-700 border-brand-200",
  Kale: "bg-brand-50 text-brand-700 border-brand-200",
  Cabbage: "bg-brand-50 text-brand-700 border-brand-200",
  Rice: "bg-blue-50 text-blue-700 border-blue-200",
  Maize: "bg-amber-50 text-amber-700 border-amber-200",
  Onions: "bg-violet-50 text-violet-700 border-violet-200",
  Potatoes: "bg-blue-50 text-blue-700 border-blue-200",
};

/** "Tomatoes, Rice" -> "Tomatoes" */
const firstCrop = (name) => String(name ?? "").split(",")[0].trim();

/**
 * The farmer's crops, with the risk badge and the performance bar. The rows
 * come from the platform when the farmer is signed in and from the sample
 * grid otherwise, so the card always shows the same thing.
 */
export default function CropsCard({ crops = [], onNavigate }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>My crops</CardTitle>
          <CardSubtitle>{crops.length} crops in season</CardSubtitle>
        </div>
        <Button
          size="sm"
          variant="ghost"
          iconRight={ArrowRight}
          onClick={() => onNavigate("crops")}
        >
          View all
        </Button>
      </CardHeader>

      <CardBody className="space-y-2.5">
        {crops.length === 0 && (
          <EmptyState
            compact
            icon={Sprout}
            title="No crops yet"
            text="Add a crop to a farm and it will show up here with its risk and harvest date."
          />
        )}

        {crops.map((c) => {
          const name = firstCrop(c.crop);
          const Icon = CROP_ICONS[name] ?? Sprout;

          return (
            <button
              key={`${c.id}-${c.cropId ?? c.crop}`}
              type="button"
              onClick={() => onNavigate("crops")}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3 text-left transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/50"
            >
              <span
                className={`grid h-10 w-10 flex-none place-items-center rounded-xl border ${
                  CROP_TONES[name] ?? CROP_TONES["French Beans"]
                }`}
                aria-hidden="true"
              >
                <Icon size={20} />
              </span>

              <span className="min-w-0 flex-1 space-y-1">
                <strong className="block truncate text-sm font-bold text-foreground">{c.crop}</strong>
                <small className="block truncate text-[11px] font-medium text-muted-foreground">
                  {c.name} · {(c.kg / 1000).toFixed(1)} t · Harvest {c.harvest}
                </small>
                {c.perf != null && <Progress value={c.perf} size="sm" label={`${c.crop} performance`} />}
              </span>

              <Badge tone={riskTone(c.risk)} className="flex-none">
                {c.risk}
              </Badge>
            </button>
          );
        })}
      </CardBody>
    </Card>
  );
}
