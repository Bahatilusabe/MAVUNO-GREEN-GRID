import { Leaf, MapPin, Store, Truck } from "lucide-react";

/** The names that pass across the strip. */
const ITEMS = [
  { icon: Leaf, label: "Tomatoes" },
  { icon: Leaf, label: "French beans" },
  { icon: Leaf, label: "Rice" },
  { icon: Leaf, label: "Maize" },
  { icon: Leaf, label: "Avocado" },
  { icon: Leaf, label: "Sukuma wiki" },
  { icon: Store, label: "Nairobi Fresh Markets" },
  { icon: Store, label: "Kagio Juice Processors" },
  { icon: Store, label: "Kirieyaga Cold Storage" },
  { icon: MapPin, label: "Kirinyaga" },
  { icon: MapPin, label: "Machakos" },
  { icon: MapPin, label: "Nakuru" },
  { icon: Truck, label: "Wakulima Transporters" },
];

/**
 * A scrolling strip of the things moving on the grid.
 *
 * The content is rendered twice and the track is translated by exactly half
 * its width, so the loop has no visible seam.
 */
export default function Marquee() {
  return (
    <div className="marquee border-y border-border bg-card/40 py-3.5" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-8 pr-8">
            {ITEMS.map((item) => (
              <li key={`${copy}-${item.label}`} className="flex shrink-0 items-center gap-2">
                <item.icon size={13} className="text-brand-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
