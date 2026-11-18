import { cn } from "../../src/lib/utils";
import { Reveal } from "../../shared/ui/Motion";

/**
 * The heading every section opens with.
 *
 * `accent` marks the part of the title that carries the gradient, so the
 * page reads as one argument rather than six unrelated blocks.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  body,
  align = "left",
  className,
}) {
  const centered = align === "center";

  return (
    <Reveal className={cn(centered && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
        {accent && <span className="text-gradient"> {accent}</span>}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-muted-foreground",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}
