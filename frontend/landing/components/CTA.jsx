import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "../../shared/ui/Motion";

/**
 * The closing call to action.
 *
 * A single gradient panel, so the page ends on one clear instruction
 * rather than trailing off.
 */
export default function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24">
      <Reveal>
        <div className="brand-panel relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12">
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--chart-2), transparent 70%)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--chart-7), transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              <Sparkles size={13} aria-hidden="true" />
              Join the grid
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Your farm is already on the grid.
              <br />
              It just is not talking to anyone yet.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Register a farm, a cold store or a truck, and the platform starts matching, planning and
              moving on the same day.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#/farmer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-brand-800 shadow-lg transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-xl"
              >
                Start as a farmer
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="#/partner"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 px-5 text-sm font-extrabold text-white transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:bg-white/10"
              >
                Start as a partner
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
