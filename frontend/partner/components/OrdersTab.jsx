import { ShoppingCart, Truck, CheckCircle2 } from "lucide-react";
import { fmt } from "../../shared/utils";
import Badge from "../../shared/ui/Badge";
import Button from "../../shared/ui/Button";
import { Card, CardHeader, CardTitle, CardBody } from "../../shared/ui/Card";
import { DataTable } from "../../shared/ui/Table";
import EmptyState from "../../shared/ui/EmptyState";
import { normalizeStatus, statusTone, titleStatus } from "../../shared/status";

/** The fulfilment lifecycle, and the label for the button that advances it. */
const NEXT_STEP = {
  scheduled: { next: "in transit", label: "Mark in transit", icon: Truck },
  "in transit": { next: "delivered", label: "Mark delivered", icon: CheckCircle2 },
};

export default function OrdersTab({ orders, onAdvance, busyId }) {
  const columns = [
    {
      key: "farmer",
      header: "Farmer",
      render: (o) => <strong className="font-bold text-foreground">{o.farmer}</strong>,
    },
    {
      key: "crop",
      header: "Crop",
      render: (o) => <span className="font-medium text-foreground/80">{o.crop}</span>,
    },
    {
      key: "kg",
      header: "Quantity",
      render: (o) => <span className="font-semibold tabular">{fmt(o.kg)} kg</span>,
    },
    {
      key: "value",
      header: "Value",
      render: (o) => <span className="font-semibold tabular">KES {fmt(o.value ?? o.kg * o.price)}</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (o) => <span className="font-medium text-muted-foreground">{o.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (o) => <Badge tone={statusTone(o.status)}>{titleStatus(o.status)}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (o) => {
        const step = NEXT_STEP[normalizeStatus(o.status)];
        if (!step) return <span className="text-xs font-medium text-muted-foreground">—</span>;
        const busy = busyId === o.id;
        return (
          <Button
            size="sm"
            variant="secondary"
            icon={step.icon}
            loading={busy}
            onClick={() => onAdvance(o, step.next)}
          >
            {step.label}
          </Button>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-blue-50 text-blue-700"
            aria-hidden="true"
          >
            <ShoppingCart size={18} />
          </span>
          <div>
            <CardTitle>Orders Management</CardTitle>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              Accepted requests being fulfilled
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </CardHeader>

      <CardBody>
        <DataTable
          columns={columns}
          rows={orders}
          empty={
            <EmptyState
              icon={ShoppingCart}
              title="No active orders"
              text="Accept a farmer request and it becomes an order you can move through pickup and delivery."
            />
          }
        />
      </CardBody>
    </Card>
  );
}
