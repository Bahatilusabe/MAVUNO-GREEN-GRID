import { COLORS } from "../../shared/chartColors";
import { withAlpha } from "../../src/theme/palettes";

/**
 * Tone helpers for the landing page.
 *
 * The landing page uses the chart palette rather than the semantic status
 * tones, because its icons are decorative accents — and accents should
 * follow whatever palette the reader has chosen.
 */

const TONES = {
  green: () => COLORS.green,
  blue: () => COLORS.blue,
  amber: () => COLORS.amber,
  purple: () => COLORS.purple,
  teal: () => COLORS.teal,
  red: () => COLORS.red,
  indigo: () => COLORS.indigo,
  gray: () => COLORS.ink,
};

export const toneColor = (tone) => (TONES[tone] ?? TONES.green)();

/** A soft wash of the tone, for the chip behind an icon. */
export const toneWash = (tone, alpha = 0.12) => withAlpha(toneColor(tone), alpha);
