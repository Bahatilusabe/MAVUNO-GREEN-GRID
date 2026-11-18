import { PartyPopper, TriangleAlert } from "lucide-react";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import EmptyState from "../../shared/ui/EmptyState";
import { alertTone } from "../../shared/status";

export default function AlertsCard({ alerts, onResolve }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <TriangleAlert size={18} />
          </span>
          <div className="min-w-0">
            <CardTitle>Open alerts</CardTitle>
            <CardSubtitle>
              {alerts.length ? `${alerts.length} need review` : "Nothing needs review"}
            </CardSubtitle>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        {alerts.length ? (
          alerts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-3.5 transition-colors duration-200 hover:bg-muted/70"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Badge tone={alertTone(a.level)} dot className="flex-none">
                  {a.level}
                </Badge>
                <p className="truncate text-xs font-medium text-foreground/90 sm:text-sm">{a.text}</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="flex-none"
                onClick={() => onResolve(a.id)}
              >
                Resolve
              </Button>
            </div>
          ))
        ) : (
          <EmptyState
            compact
            icon={PartyPopper}
            title="No open alerts"
            text="Every alert on the platform has been reviewed. New ones appear here as they are raised."
          />
        )}
      </CardBody>
    </Card>
  );
}
