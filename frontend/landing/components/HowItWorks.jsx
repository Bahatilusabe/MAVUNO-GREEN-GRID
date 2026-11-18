import { ArrowRight, RefreshCw } from "lucide-react";
import { STAGES } from "../data";
import SectionHeading from "./SectionHeading";
import { Reveal } from "../../shared/ui/Motion";
import { toneColor, toneWash } from "./tone";

/**
 * How the grid operates.
 *
 * The five stages are a loop, not a pipeline: what the grid learns in
 * stage five becomes what it senses in stage one. The connectors flow, and
 * the return path is drawn explicitly so the loop is legible rather than
 * implied.
 */
export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24" id="how">
      {/* A soft wash so the loop reads as a distinct band on the page */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, color-mix(in srgb, var(--brand-400) 12%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="How the grid runs"
          title="Five stages, and it"
          accent="never stops turning."
          body="Every farm on the grid moves through the same loop. The output of the last stage is the input of the first, so the grid gets sharper the longer it runs."
        />

        <div className="relative mt-14">
          {/* Horizontal connector behind the stage row (large screens) */}
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[4.75rem] hidden h-[2px] lg:block"
            aria-hidden="true"
          >
            <div className="flow-line w-full" />
          </div>

          <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STAGES.map((stage, i) => {
              const color = toneColor(stage.tone);
              return (
                <Reveal key={stage.id} index={i % 5}>
                  <li className="group relative flex h-full list-none flex-col gap-3.5">
                    {/* Node: sits on the connector line */}
                    <div className="flex items-center gap-3">
                      <span
                        className="relative grid h-14 w-14 flex-none place-items-center rounded-2xl border-2 border-border bg-card shadow-card transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-1"
                        style={{ borderColor: color }}
                        aria-hidden="true"
                      >
                        <span
                          className="grid h-full w-full place-items-center rounded-[0.85rem]"
                          style={{ background: toneWash(stage.tone, 0.14), color }}
                        >
                          <stage.icon size={22} />
                        </span>
                        <span
                          className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full text-[10px] font-extrabold text-white shadow-sm"
                          style={{ background: color }}
                        >
                          {i + 1}
                        </span>
                      </span>
                    </div>

                    <div className="surface flex h-full flex-col gap-2.5 p-5 transition-shadow duration-300 ease-[var(--ease-out-soft)] group-hover:shadow-card-hover">
                      <h3 className="text-base font-extrabold tracking-tight text-foreground">
                        {stage.title}
                      </h3>
                      <p className="text-xs font-bold leading-snug" style={{ color }}>
                        {stage.lede}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
                      <ul className="mt-auto space-y-1.5 pt-2">
                        {stage.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 text-xs font-medium text-muted-foreground">
                            <span
                              className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                              style={{ background: color }}
                              aria-hidden="true"
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>

          {/* The return path: stage five feeds back into stage one */}
          <div className="relative mt-6 hidden lg:block" aria-hidden="true">
            <svg viewBox="0 0 1000 70" className="h-14 w-full" preserveAspectRatio="none">
              <path
                d="M900 4 C 900 60, 100 60, 100 4"
                fill="none"
                stroke="var(--brand-400)"
                strokeWidth="2"
                strokeDasharray="10 12"
                opacity="0.7"
                style={{ animation: "dash-flow 3s linear infinite" }}
              />
            </svg>
          </div>

          <Reveal>
            <p className="mx-auto mt-2 flex max-w-xl items-center justify-center gap-2.5 text-center text-sm font-semibold text-muted-foreground">
              <RefreshCw size={15} className="text-brand-600" aria-hidden="true" />
              What the grid learns goes straight back into what it senses.
              <ArrowRight size={15} className="text-brand-600" aria-hidden="true" />
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
