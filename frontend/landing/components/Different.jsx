import { Check, X } from "lucide-react";
import { COMPARISONS, DIFFERENCES } from "../data";
import SectionHeading from "./SectionHeading";
import { Reveal } from "../../shared/ui/Motion";
import { toneColor, toneWash } from "./tone";

/**
 * What makes the grid different.
 *
 * The comparison is written as pairs, because "different" only means
 * something against the alternative a farmer already has. The left column
 * is the chain as it works today; the right is the grid.
 */
export default function Different() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24" id="different">
      <SectionHeading
        eyebrow="What makes it different"
        title="Same land, same labour."
        accent="A different chain."
        body="Nothing here asks a farmer to work harder or plant more. Every difference below comes from coordinating the value chain better — not from changing how the farm is run."
      />

      {/* ------------------------------------------------------------- */}
      {/* Comparison                                                      */}
      {/* ------------------------------------------------------------- */}
      <Reveal className="mt-12">
        <div className="surface overflow-hidden rounded-2xl">
          {/* Column headers — large screens only */}
          <div className="hidden grid-cols-3 lg:grid">
            <div className="bg-muted px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Dimension
            </div>
            <div className="flex items-center gap-2 bg-muted px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <X size={13} aria-hidden="true" />
              The usual chain
            </div>
            <div className="flex items-center gap-2 bg-brand-50 px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-brand-800">
              <Check size={13} aria-hidden="true" />
              The Green Grid
            </div>
          </div>

          {COMPARISONS.map((row, i) => (
            <div
              key={row.dimension}
              className="grid border-t border-border lg:grid-cols-3 lg:border-t-0 lg:divide-x lg:divide-border"
              style={i > 0 ? undefined : undefined}
            >
              <div className="px-6 pb-1 pt-5 lg:px-6 lg:py-5">
                <h3 className="text-sm font-extrabold tracking-tight text-foreground">{row.dimension}</h3>
              </div>

              <div className="flex gap-3 px-6 pb-4 pt-1 lg:bg-muted/40 lg:px-6 lg:py-5">
                <span className="w-24 flex-none text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 lg:hidden">
                  Usual
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{row.usual}</span>
              </div>

              <div className="flex gap-3 px-6 pb-5 pt-1 lg:bg-brand-50/50 lg:px-6 lg:py-5">
                <span className="w-24 flex-none text-[10px] font-bold uppercase tracking-wider text-brand-700 lg:hidden">
                  Grid
                </span>
                <span className="text-sm font-semibold leading-relaxed text-foreground">{row.grid}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ------------------------------------------------------------- */}
      {/* The three structural differences                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {DIFFERENCES.map((d, i) => {
          const color = toneColor(d.tone);
          return (
            <Reveal key={d.title} index={i}>
              <article className="ring-gradient surface-interactive group flex h-full flex-col gap-3 p-6">
                <span
                  className="halo grid h-11 w-11 flex-none place-items-center rounded-xl"
                  style={{ background: toneWash(d.tone, 0.14), color }}
                  aria-hidden="true"
                >
                  <d.icon size={20} />
                </span>
                <h3 className="text-base font-extrabold tracking-tight text-foreground">{d.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
