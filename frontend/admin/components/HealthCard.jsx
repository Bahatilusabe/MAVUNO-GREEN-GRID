import { HeartPulse } from "lucide-react";
import Card, { CardBody, CardHeader, CardTitle, CardSubtitle } from "../../shared/ui/Card";
import Badge from "../../shared/ui/Badge";
import { motion } from "framer-motion";
import { HEALTH } from "../data";

const TONE = { ok: "success", warn: "warning", bad: "danger" };

export default function HealthCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700 shadow-sm"
            aria-hidden="true"
          >
            <HeartPulse size={18} className="animate-pulse" />
          </span>
          <div className="min-w-0">
            <CardTitle>System health</CardTitle>
            <CardSubtitle>Service status for the platform</CardSubtitle>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        {HEALTH.map(([name, state, tone]) => (
          <motion.div
            key={name}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-3.5 transition-all duration-200 hover:bg-muted/70 hover:border-brand-200"
          >
            <span className="min-w-0 truncate text-xs font-semibold text-foreground sm:text-sm">
              {name}
            </span>
            <Badge tone={TONE[tone] ?? "neutral"} dot>
              {state}
            </Badge>
          </motion.div>
        ))}

        <p className="pt-1 text-center text-[11px] font-medium text-muted-foreground">
          Sample data · connect a monitoring service to report live service status
        </p>
      </CardBody>
    </Card>
  );
}
