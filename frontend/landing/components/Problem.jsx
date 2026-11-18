import { PROBLEMS } from "../data";
import SectionHeading from "./SectionHeading";
import { Reveal } from "../../shared/ui/Motion";
import { toneColor, toneWash } from "./tone";

/**
 * The problem section.
 *
 * Six failure modes of the existing chain, each with the number that makes
 * it concrete. The cards are deliberately unflattering to the status quo:
 * this is the argument for the grid.
 */
export default function Problem() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24" id="problem">
      <SectionHeading
        eyebrow="The problem"
        title="Kenya grows enough food."
        accent="The chain loses it anyway."
        body="The crops exist, the buyers exist and the cold rooms exist. What is missing is the layer that connects them — so the loss shows up as spoilage on the farm, as a truck running empty, and as a farmer learning the price of their crop from whoever arrived first."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p, i) => {
          const color = toneColor(p.tone);
          return (
            <Reveal key={p.id} index={i % 3}>
              <article className="group surface-interactive ring-gradient relative flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="halo grid h-11 w-11 flex-none place-items-center rounded-xl"
                    style={{ background: toneWash(p.tone, 0.14), color }}
                    aria-hidden="true"
                  >
                    <p.icon size={20} />
                  </span>
                  <span className="text-right">
                    <strong
                      className="block text-2xl font-extrabold leading-none tracking-tight"
                      style={{ color }}
                    >
                      {p.stat}
                    </strong>
                    <small className="mt-1 block max-w-[10rem] text-[10px] font-semibold leading-snug text-muted-foreground">
                      {p.statLabel}
                    </small>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold tracking-tight text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
