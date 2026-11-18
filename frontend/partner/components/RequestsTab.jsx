<<<<<<< HEAD
import { useState } from "react";
import { Leaf, MessageSquare, AlertCircle } from "lucide-react";
import { fmt } from "../../shared/utils";
import DealThread from "../../shared/DealThread";

const STATUS_STYLES = {
  scheduled: "bg-green-100 text-green-800 border-green-200",
  in_transit: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function RequestsTab({ requests, stats, accepting, onChanged }) {
  const [openId, setOpenId] = useState(null);
  const openReq = requests.find((r) => r.id === openId);

  const blockedFor = (r) => r.kg > stats.remaining || !accepting;

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg">
          <Leaf aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Incoming Farmer Requests</h3>
      </div>
=======
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
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf

        {requests.map((r) => {
          const status = r.status.toLowerCase();
          const isPending = status === "pending";
          const tooBig = r.kg > stats.remaining;
<<<<<<< HEAD
          const yourTurn = isPending && r.pendingFrom === "farmer";
          const price = r.pendingPrice ?? r.pricePerKg;

          return (
            <div
              key={r.id}
              className="bg-gray-50/70 border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 mt-0.5">
                  <Leaf aria-hidden="true" size={18} />
                </div>
                <div className="min-w-0 space-y-1">
                  <strong className="block text-sm font-bold text-gray-900 truncate">{r.farmerName}</strong>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600 font-medium">
                    <span>{r.crop}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-900">{fmt(r.kg)} kg</span>
                    {r.county && (
                      <>
                        <span>•</span>
                        <span>{r.county}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {isPending ? (r.pendingFrom === "partner" ? "Your offer: " : "Their offer: ") : "Price: "}
                    <span className="font-bold text-green-800">KES {price}/kg</span>
                    {r.pickupDate && <> • Pickup: {r.pickupDate}</>}
                  </div>
                  {isPending && tooBig && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pt-1" role="alert">
                      <AlertCircle size={14} /> Exceeds free capacity ({fmt(stats.remaining)} kg).
                    </div>
=======
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
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
                  )}
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {!isPending && (
                  <span
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
                      STATUS_STYLES[status] ?? "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </span>
=======
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
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
                )}
                {yourTurn && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800">
                    Your turn
                  </span>
                )}
                <button
                  onClick={() => setOpenId(r.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-green-700 hover:bg-green-800 text-white flex items-center gap-1"
                >
                  <MessageSquare size={14} /> {isPending ? "Negotiate" : "View"}
                </button>
              </div>
            </article>
          );
        })}
<<<<<<< HEAD
      </div>

      {!requests.length && (
        <div className="p-12 text-center text-gray-500 text-sm font-medium">No incoming requests at the moment.</div>
      )}

      {openReq && (
        <DealThread
          dealId={openReq.id}
          blockAccept={blockedFor(openReq)}
          onClose={() => setOpenId(null)}
          onChanged={onChanged}
        />
      )}
    </section>
=======
      </CardBody>
    </Card>
>>>>>>> bc10d954ae03e2b9d6c2610ba7a6dff6b70d41cf
  );
}
