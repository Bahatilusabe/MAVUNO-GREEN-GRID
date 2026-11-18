import { useMemo, useState } from "react";
import { Check, Handshake, Link2, UserCheck, X } from "lucide-react";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import EmptyState from "../../shared/ui/EmptyState";
import { cn } from "../../src/lib/utils";
import { partnerStatusTone } from "../../shared/status";

const API_STATUS = { Approved: "approved", Pending: "pending", Rejected: "rejected" };

/**
 * Partner applications.
 *
 * A partner is only useful to the grid once it is approved *and* linked to
 * an account: the account is what signs in and sees the request inbox, so
 * the console links the two here.
 */
export default function PartnersCard({ partners, accounts = [], onDecide, onLink, busyId }) {
  const [picked, setPicked] = useState({});

  // Accounts that are not already attached to a partner.
  const available = useMemo(() => {
    const taken = new Set(partners.map((p) => p.userId).filter(Boolean));
    return accounts.filter((a) => !taken.has(a.id));
  }, [accounts, partners]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700"
            aria-hidden="true"
          >
            <Handshake size={18} />
          </span>
          <div className="min-w-0">
            <CardTitle>Partner applications</CardTitle>
            <CardSubtitle>
              {partners.filter((p) => p.status === "Pending").length} waiting for a decision
            </CardSubtitle>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        {partners.length ? (
          partners.map((p) => {
            const busy = busyId === `partner:${p.id}`;

            return (
              <div
                key={p.id}
                className="rounded-xl border border-border bg-muted/40 p-3.5 transition-colors duration-200 hover:bg-muted/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-bold text-foreground">
                      {p.name}
                    </strong>
                    <small className="block truncate text-xs font-medium text-muted-foreground">
                      {p.type} · {p.county}
                      {p.pendingRequests ? ` · ${p.pendingRequests} pending requests` : ""}
                      {p.requests ? ` · ${p.requests} total` : ""}
                    </small>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    {p.status === "Pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Check}
                          loading={busy}
                          onClick={() => onDecide(p, API_STATUS.Approved)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={X}
                          loading={busy}
                          onClick={() => onDecide(p, API_STATUS.Rejected)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Badge tone={partnerStatusTone(p.status)} dot>
                        {p.status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Account link: without one the partner cannot sign in. */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  {p.userId ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-700">
                      <UserCheck size={13} aria-hidden="true" />
                      {p.userEmail || `Account #${p.userId}`}
                    </span>
                  ) : (
                    <>
                      <label className="sr-only" htmlFor={`partner-account-${p.id}`}>
                        Account for {p.name}
                      </label>
                      <select
                        id={`partner-account-${p.id}`}
                        value={picked[p.id] ?? ""}
                        onChange={(e) => setPicked((cur) => ({ ...cur, [p.id]: e.target.value }))}
                        disabled={busy || available.length === 0}
                        className={cn(
                          "min-w-0 flex-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none transition-colors duration-200",
                          "focus:border-brand-500 focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60",
                        )}
                      >
                        <option value="">
                          {available.length ? "Link an account…" : "No free accounts"}
                        </option>
                        {available.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} · {a.email || "no email"}
                          </option>
                        ))}
                      </select>

                      <Button
                        size="sm"
                        variant="outline"
                        icon={Link2}
                        disabled={busy || !picked[p.id]}
                        loading={busy}
                        onClick={() => onLink(p, Number(picked[p.id]))}
                      >
                        Link
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            compact
            icon={Handshake}
            title="No partners yet"
            text="Partner applications will appear here as soon as they are submitted."
          />
        )}
      </CardBody>
    </Card>
  );
}
