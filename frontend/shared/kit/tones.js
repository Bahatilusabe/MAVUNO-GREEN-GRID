export const TONES = ["green", "blue", "amber", "red", "purple", "gray"];

// Colours come from CSS variables, so every tone follows light and dark automatically
export const toneStyle = (tone = "green") => {
  const t = TONES.includes(tone) ? tone : "green";
  return { backgroundColor: `var(--tone-${t}-bg)`, color: `var(--tone-${t}-fg)` };
};