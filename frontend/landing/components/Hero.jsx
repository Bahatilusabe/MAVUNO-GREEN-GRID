import { ArrowRight, Sparkles } from "lucide-react";
import { HERO } from "../data";
import GridArt from "./GridArt";
import { Reveal } from "../../shared/ui/Motion";

/**
 * The hero.
 *
 * Answers the first question — *what is this* — in one line, over an
 * animated scene of the grid at work. The artwork on the right is live SVG
 * built from the active palette, so it changes colour with the theme.
 */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden" id="top">
      <div className="aurora" aria-hidden="true">
        <span className="aurora__blob aurora__blob--1" />
        <span className="aurora__blob aurora__blob--2" />
        <span className="aurora__blob aurora__blob--3" />
      </div>
      <div className="grid-lines" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ---------------------------------------------------------- */}
          {/* Copy                                                        */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-70"
                    style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                {HERO.eyebrow}
              </span>
            </Reveal>

            <Reveal index={1}>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
                {HERO.title}{" "}
                <span className="text-gradient">{HERO.titleAccent}</span>
              </h1>
            </Reveal>

            <Reveal index={2}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {HERO.body}
              </p>
            </Reveal>

            <Reveal index={3}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={HERO.primary.href}
                  className="group inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 px-5 text-sm font-bold text-white shadow-pop transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                >
                  <Sparkles size={16} aria-hidden="true" />
                  {HERO.primary.label}
                </a>
                <a
                  href={HERO.secondary.href}
                  className="group inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
                >
                  {HERO.secondary.label}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </Reveal>

            <Reveal index={4}>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                {HERO.markers.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Icon size={15} className="text-brand-600" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Artwork                                                     */}
          {/* ---------------------------------------------------------- */}
          <Reveal index={2} className="lg:col-span-6">
            <div className="relative">
              <div
                className="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, color-mix(in srgb, var(--brand-400) 45%, transparent), transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div className="surface overflow-hidden rounded-[2rem] p-2 sm:p-3">
                <GridArt />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
