import { AlertCircle, Check, Inbox, Leaf, X } from "lucide-react";
import { fmt } from "../../shared/utils";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import { Card, CardHeader, CardTitle, CardBody } from "../../shared/ui/Card";
import EmptyState from "../../shared/ui/EmptyState";
import { normalizeStatus, statusTone, titleStatus } from "../../shared/status";

export default function RequestsTab({ requests, stats, accepting, onDecide, busyId }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Farmer Requests</CardTitle>
        <span className="text-xs font-semibold text-muted-foreground">
          {requests.length} total
        </span>
      </CardHeader>

      <CardBody className="space-y-3">
        {requests.length === 0 && (
          <EmptyState
            compact
            icon={Inbox}
            title="No incoming requests"
            text="When a farmer sends you produce from the market, it lands here."
          />
        )}

        {requests.map((r) => {
          const tooBig = r.kg > stats.remaining;
          const pending = normalizeStatus(r.status) === "pending";
          const blocked = tooBig || !accepting;
          const busy = busyId === r.id;

          return (
            <article
              key={r.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-muted/40 p-4 transition-colors duration-200 hover:bg-muted/70 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <span
                  className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
                  aria-hidden="true"
                >
                  <Leaf size={17} />
                </span>

                <div className="min-w-0 space-y-1">
                  <strong className="block truncate text-sm font-bold text-foreground">{r.farmer}</strong>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs font-medium text-muted-foreground">
                    <span>{r.crop}</span>
                    <span aria-hidden="true">•</span>
                    <span className="font-bold tabular text-foreground">{fmt(r.kg)} kg</span>
                    <span aria-hidden="true">•</span>
                    <span>{r.county}</span>
                    {r.km != null && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{r.km} km away</span>
                      </>
                    )}
                  </div>

                  <div className="text-xs font-medium text-muted-foreground">
                    Offer: <span className="font-bold tabular text-brand-800">KES {r.price}/kg</span>
                    {" · "}Pickup: {r.date}
                  </div>

                  {pending && tooBig && (
                    <p
                      className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-destructive"
                      role="alert"
                    >
                      <AlertCircle size={14} aria-hidden="true" /> Exceeds free capacity (
                      {fmt(stats.remaining)} kg).
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-none items-center gap-2 self-end sm:self-center">
                {pending ? (
                  <>
                    <Button
                      size="sm"
                      icon={Check}
                      disabled={blocked || busy}
                      loading={busy}
                      title={blocked ? "Not enough capacity, or the partner is paused" : ""}
                      onClick={() => onDecide(r, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={X}
                      disabled={busy}
                      onClick={() => onDecide(r, false)}
                    >
                      Decline
                    </Button>
                  </>
                ) : (
                  <Badge tone={statusTone(r.status)}>{titleStatus(r.status)}</Badge>
                )}
              </div>
            </article>
          );
        })}
      </CardBody>
    </Card>
  );
}
