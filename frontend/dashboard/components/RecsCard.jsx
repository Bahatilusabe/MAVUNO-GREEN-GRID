import { ArrowRight, CircleAlert, PartyPopper, Sparkles, Sprout, Store, Warehouse, X } from "lucide-react";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import { recommendationTone } from "../../shared/status";

const RECOMMENDATION_ICONS = {
  Harvest: Sprout,
  Market: Store,
  Storage: Warehouse,
};

const TONE_CHIP = {
  danger: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-blue-50 text-blue-600",
  success: "bg-brand-50 text-brand-700",
  neutral: "bg-muted text-muted-foreground",
};

const TONE_EDGE = {
  danger: "border-red-200 bg-red-50/50",
  warning: "border-amber-200 bg-amber-50/50",
  info: "border-blue-200 bg-blue-50/50",
  success: "border-brand-200 bg-brand-50/50",
  neutral: "border-border bg-muted/40",
};

/**
 * The AI recommendations.
 *
 * The tone map used to be keyed `red | amber | green | blue` while the data
 * carries `danger | info`, so every recommendation fell through to the grey
 * default. The shared `recommendationTone` understands both vocabularies.
 */
export default function RecsCard({ recs = [], onDismiss, onNavigate }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <Sparkles size={18} />
          </span>
          <div className="min-w-0">
            <CardTitle>AI recommendations</CardTitle>
            <CardSubtitle>What the grid suggests you do next</CardSubtitle>
          </div>
        </div>

        <Button size="sm" variant="ghost" iconRight={ArrowRight} onClick={() => onNavigate("recs")}>
          View all
        </Button>
      </CardHeader>

      <CardBody className="space-y-2.5">
        {recs.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
            <PartyPopper size={20} className="text-brand-600" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">You&apos;re all caught up</span>
            <p className="text-xs font-medium text-muted-foreground">
              New recommendations appear as the grid picks up on your farms.
            </p>
          </div>
        )}

        {recs.map((r) => {
          const Icon = RECOMMENDATION_ICONS[r.kind] ?? CircleAlert;
          const tone = recommendationTone(r.tone);
          const confidence = Number(r.conf);

          return (
            <div
              key={r.id}
              className={`group relative flex items-start gap-3 rounded-xl border p-3.5 transition-[border-color,box-shadow] duration-200 hover:shadow-card ${
                TONE_EDGE[tone] ?? TONE_EDGE.neutral
              }`}
            >
              <span
                className={`mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl ${
                  TONE_CHIP[tone] ?? TONE_CHIP.neutral
                }`}
                aria-hidden="true"
              >
                <Icon size={18} />
              </span>

              <div className="min-w-0 flex-1 space-y-1 pr-6">
                <strong className="block text-sm font-bold leading-snug text-foreground">
                  {r.title}
                </strong>
                <p className="text-xs leading-relaxed text-foreground/75">{r.text}</p>

                {Number.isFinite(confidence) && (
                  <div className="pt-0.5">
                    <Badge tone={tone === "neutral" ? "neutral" : tone}>
                      {Math.round(confidence)}% confidence
                    </Badge>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity duration-150 hover:bg-muted hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
                aria-label={`Dismiss ${r.title}`}
                onClick={() => onDismiss(r.id)}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
