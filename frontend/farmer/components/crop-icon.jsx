import { Cherry, Leaf, Sprout, Wheat } from "lucide-react";
import { cn } from "../../src/lib/utils";

const CROP_ICONS = {
  Tomatoes: Cherry,
  "French Beans": Sprout,
  Beans: Sprout,
  Kale: Sprout,
  Cabbage: Leaf,
  Rice: Wheat,
  Maize: Wheat,
  Onions: Leaf,
  Potatoes: Leaf,
};

/**
 * The tone per crop, so a tomato tile never renders like a rice tile.
 * A farm can hold several crops at once and the UI joins their names, so the
 * tile always shows the first one.
 */
const CROP_TONE = {
  Tomatoes: "amber",
  "French Beans": "green",
  Beans: "green",
  Kale: "green",
  Cabbage: "green",
  Rice: "blue",
  Maize: "amber",
  Onions: "purple",
  Potatoes: "blue",
};

const TONES = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  green: "bg-brand-50 text-brand-700 border-brand-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
};

/** "Tomatoes, Rice" -> "Tomatoes" */
export const firstCrop = (name) => String(name ?? "").split(",")[0].trim();

export function CropIcon({ crop, size = 20 }) {
  const Icon = CROP_ICONS[firstCrop(crop)] ?? Sprout;
  return <Icon aria-hidden="true" size={size} />;
}

/** The square crop tile used in farm lists, crop cards and detail headers. */
export function Thumb({ crop, size = 64, className }) {
  const name = firstCrop(crop);
  return (
    <div
      className={cn(
        "grid flex-none place-items-center rounded-xl border",
        TONES[CROP_TONE[name] ?? "green"],
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <CropIcon crop={name} size={Math.round(size * 0.45)} />
    </div>
  );
}
