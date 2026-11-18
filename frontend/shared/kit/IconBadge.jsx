import { toneStyle } from "./tones";

const SIZES = { sm: [32, 16], md: [40, 20], lg: [48, 24] };

export default function IconBadge({ icon: Icon, tone = "green", size = "md", className = "" }) {
  const [box, glyph] = SIZES[size] ?? SIZES.md;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${className}`}
      style={{ width: box, height: box, ...toneStyle(tone) }}
    >
      <Icon size={glyph} aria-hidden="true" />
    </span>
  );
}