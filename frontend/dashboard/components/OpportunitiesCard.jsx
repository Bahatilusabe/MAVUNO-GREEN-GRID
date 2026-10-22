import { ArrowRight, Link2 } from "lucide-react";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import EmptyState from "../../shared/ui/EmptyState";
import { statusTone, titleStatus } from "../../shared/status";

/**
 * Nearby opportunities.
 *
 * The card reads the farmer's own match requests, so a site that already has
 * a request shows its real status instead of a hopeful "Matched" label that
 * was never persisted. Sending a request happens in the opportunities view,
 * where the crop and the tonnage can be chosen.
 */
export default function OpportunitiesCard({ opportunities = [], live, requestFor, onNavigate }) {
  const list = opportunities.slice(0, 4);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <Link2 size={18} />
          </span>
          <div className="min-w-0">
            <CardTitle>Nearby opportunities</CardTitle>
            <CardSubtitle>
              {live ? "Live listings near your farms" : "Sample listings near your farms"}
            </CardSubtitle>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          iconRight={ArrowRight}
          onClick={() => onNavigate("opportunities")}
        >
          View all
        </Button>
      </CardHeader>

      <CardBody className="space-y-2.5">
        {list.length === 0 && (
          <EmptyState
            compact
            icon={Link2}
            title="No opportunities yet"
            text="Buyers, processors and storage sites near your farms will appear here."
          />
        )}

        {list.map((o) => {
          const match = requestFor?.(o);

          return (
            <div
              key={o.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors duration-200 hover:border-brand-200 hover:bg-brand-50/40"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <strong className="block truncate text-sm font-bold text-foreground">{o.name}</strong>
                <small className="block truncate text-[11px] font-medium text-muted-foreground">
                  {o.type}
                  {o.km != null ? ` · ${Number(o.km).toFixed(0)} km away` : ""} · {o.price}
                </small>
                <small className="block truncate text-[11px] font-semibold text-brand-700">
                  {o.cap}
                </small>
              </div>

              {match ? (
                <Badge tone={statusTone(match.status)} className="flex-none" dot>
                  {titleStatus(match.status)}
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-none"
                  onClick={() => onNavigate("opportunities")}
                >
                  Match
                </Button>
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
