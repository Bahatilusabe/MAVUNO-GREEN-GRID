import { useMemo } from "react";
import { PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { IMPACT_SOURCES, IMPACT_STATS } from "../data";
import SectionHeading from "./SectionHeading";
import { Reveal, useCountUp } from "../../shared/ui/Motion";
import { Donut } from "../../shared/charts";
import { COLORS } from "../../shared/chartColors";

/** A statistic that counts up when it scrolls into view. */
function Counter({ value, suffix, decimals = 0, label, hint }) {
  const counted = useCountUp(value, { decimals });
  return (
    <div className="surface flex flex-col gap-1 p-5">
      <span className="text-3xl font-extrabold tracking-tight text-foreground tabular">
        {counted.toLocaleString("en-KE", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        <span className="text-gradient">{suffix}</span>
      </span>
      <span className="text-xs font-bold leading-snug text-foreground">{label}</span>
      <span className="text-[11px] font-medium text-muted-foreground">{hint}</span>
    </div>
  );
}

/**
 * The impact of the grid, measured.
 *
 * The chart on the right is drawn with the live theme palette, so it is
 * colourful in every theme rather than a fixed set of hex values.
 */
export default function Impact() {
  const sources = useMemo(
    () =>
      IMPACT_SOURCES.map((s) => ({
        name: s.name,
        value: s.value,
        color: COLORS[s.color] ?? COLORS.green,
      })),
    [],
  );

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24" id="impact">
      <SectionHeading
        eyebrow="What it is worth"
        title="The grid is judged"
        accent="on what it saves."
        body="A coordination layer that does not move produce is a dashboard. These are the numbers the grid is accountable for, measured across the demo cohort."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        {/* Stat tiles */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {IMPACT_STATS.map((stat, i) => (
            <Reveal key={stat.label} index={i % 2}>
              <Counter {...stat} />
            </Reveal>
          ))}
        </div>

        {/* Chart */}
        <Reveal index={1} className="lg:col-span-5">
          <div className="surface flex h-full flex-col overflow-hidden">
            <header className="flex items-center gap-3 border-b border-border px-5 py-4">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-50 text-brand-700" aria-hidden="true">
                <PieChartIcon size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground">Where the impact comes from</h3>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  Share of total value protected
                </p>
              </div>
            </header>

            <div className="flex-1 px-3 py-4">
              <Donut data={sources} unit="%" height={220} />
            </div>

            <footer className="flex items-center gap-2 border-t border-border px-5 py-3.5 text-xs font-semibold text-muted-foreground">
              <TrendingUp size={14} className="text-brand-600" aria-hidden="true" />
              Every point here is a kilo that did not spoil.
            </footer>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
