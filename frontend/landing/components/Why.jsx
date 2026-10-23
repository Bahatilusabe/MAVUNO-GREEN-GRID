import { MISSION } from "../data";
import SectionHeading from "./SectionHeading";
import { Reveal } from "../../shared/ui/Motion";
import { toneColor, toneWash } from "./tone";

/**
 * Why the grid exists.
 *
 * The mission statement leads, because the case for a coordination layer is
 * not a feature list — it is a claim about where the loss actually comes
 * from.
 */
export default function Why() {
  const LeadIcon = MISSION.pillars[0].icon;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24" id="why">
      <SectionHeading
        eyebrow={MISSION.eyebrow}
        title="Not another place to post."
        accent="A network that moves food."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        {/* Mission statement */}
        <Reveal className="lg:col-span-5">
          <div className="brand-panel h-full p-7 sm:p-9">
            <div className="relative z-10">
              <p className="text-sm font-semibold leading-relaxed text-white/85">{MISSION.body}</p>
              <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-6">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                  <LeadIcon size={20} aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold text-white/70">
                  Built for smallholders first — the people with the least margin for waste.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Pillars */}
        <div className="grid gap-5 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1 xl:grid-cols-3">
          {MISSION.pillars.map((pillar, i) => {
            const color = toneColor(pillar.tone);
            return (
              <Reveal key={pillar.title} index={i}>
                <article className="surface-interactive group flex h-full flex-col gap-3 p-6">
                  <span
                    className="halo grid h-11 w-11 flex-none place-items-center rounded-xl"
                    style={{ background: toneWash(pillar.tone, 0.14), color }}
                    aria-hidden="true"
                  >
                    <pillar.icon size={20} />
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
