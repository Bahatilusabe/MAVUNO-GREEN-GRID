import { ArrowRight, Check } from "lucide-react";
import { PORTALS } from "../data";
import SectionHeading from "./SectionHeading";
import { Reveal } from "../../shared/ui/Motion";
import { toneColor, toneWash } from "./tone";

/**
 * The four working areas of the platform.
 *
 * Each card states what the area is for and what it contains, so a reader
 * can tell which one to open without exploring first.
 */
export default function Portals() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24" id="portals">
      <SectionHeading
        eyebrow="Inside the platform"
        title="Four areas, one"
        accent="shared picture of the grid."
        body="Farmers, buyers, transporters and administrators work from the same data, in the same theme, with the same charts. Nothing is re-entered and nothing is reconciled twice."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {PORTALS.map((portal, i) => {
          const color = toneColor(portal.tone);
          return (
            <Reveal key={portal.href + portal.title} index={i % 2}>
              <a
                href={portal.href}
                className="ring-gradient surface-interactive group flex h-full flex-col gap-4 p-6 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="halo grid h-12 w-12 flex-none place-items-center rounded-xl"
                    style={{ background: toneWash(portal.tone, 0.14), color }}
                    aria-hidden="true"
                  >
                    <portal.icon size={22} />
                  </span>
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-muted text-muted-foreground transition-all duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5 group-hover:bg-brand-50 group-hover:text-brand-700">
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold tracking-tight text-foreground transition-colors duration-200 group-hover:text-brand-800">
                    {portal.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{portal.body}</p>
                </div>

                <ul className="mt-auto grid gap-1.5 pt-1 sm:grid-cols-2">
                  {portal.points.map((point) => (
                    <li key={point} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Check size={12} style={{ color }} aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
