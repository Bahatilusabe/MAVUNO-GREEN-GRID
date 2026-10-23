import { COLORS } from "../../shared/chartColors";

/**
 * The hero illustration.
 *
 * A single SVG scene of the grid doing its job: sensing a farm, carrying
 * data along the network, and moving produce off the field. Everything is
 * drawn from the live chart palette, so the artwork recolours with the
 * theme rather than sitting on the page as a fixed PNG.
 *
 * The SVG is decorative — the hero carries the same information in text.
 */
export default function GridArt() {
  const green = COLORS.green;
  const blue = COLORS.blue;
  const amber = COLORS.amber;
  const purple = COLORS.purple;

  return (
    <svg
      viewBox="0 0 560 440"
      className="h-auto w-full"
      role="img"
      aria-label="Illustration of a farm connected to storage, market and transport by the Green Grid"
    >
      <defs>
        <linearGradient id="ga-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.16" />
          <stop offset="55%" stopColor={green} stopOpacity="0.10" />
          <stop offset="100%" stopColor={green} stopOpacity="0.04" />
        </linearGradient>

        <linearGradient id="ga-hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={green} stopOpacity="0.30" />
          <stop offset="100%" stopColor={green} stopOpacity="0.12" />
        </linearGradient>

        <linearGradient id="ga-hill-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={green} stopOpacity="0.55" />
          <stop offset="100%" stopColor={green} stopOpacity="0.22" />
        </linearGradient>

        <linearGradient id="ga-field" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={amber} stopOpacity="0.55" />
          <stop offset="100%" stopColor={amber} stopOpacity="0.18" />
        </linearGradient>

        <radialGradient id="ga-sun" cx="50%" cy="50%">
          <stop offset="0%" stopColor={amber} stopOpacity="0.85" />
          <stop offset="100%" stopColor={amber} stopOpacity="0" />
        </radialGradient>

        <clipPath id="ga-clip">
          <rect x="0" y="0" width="560" height="440" rx="30" />
        </clipPath>
      </defs>

      <g clipPath="url(#ga-clip)">
        {/* Sky */}
        <rect width="560" height="440" fill="url(#ga-sky)" />

        {/* Sun, with rings pulsing outward as the grid reads the field */}
        <circle cx="432" cy="92" r="72" fill="url(#ga-sun)" />
        <circle cx="432" cy="92" r="24" fill={amber} opacity="0.9" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="432"
            cy="92"
            r="26"
            fill="none"
            stroke={amber}
            strokeWidth="1.5"
            opacity="0"
            style={{ animation: `pulse-ring 3.4s ${i * 1.13}s ease-out infinite` }}
          />
        ))}

        {/* Distant hills */}
        <path d="M-20 300 Q 90 236 200 292 T 420 268 T 580 300 L 580 440 L -20 440 Z" fill="url(#ga-hill-far)" />
        <path d="M-20 340 Q 120 288 260 336 T 580 322 L 580 440 L -20 440 Z" fill="url(#ga-hill-near)" />

        {/* Crop rows on the near field, swaying gently */}
        <g opacity="0.85">
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} transform={`translate(${38 + i * 26}, 352)`}>
              <path
                d="M0 26 Q 4 12 0 0"
                fill="none"
                stroke={green}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  transformOrigin: "0px 26px",
                  animation: `float-y ${3 + (i % 4) * 0.5}s ease-in-out ${i * 0.12}s infinite`,
                }}
              />
              <path
                d="M0 26 Q -4 14 -6 6"
                fill="none"
                stroke={green}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.75"
                style={{
                  transformOrigin: "0px 26px",
                  animation: `float-y ${3.4 + (i % 3) * 0.6}s ease-in-out ${i * 0.14}s infinite`,
                }}
              />
            </g>
          ))}
        </g>

        {/* Solar array feeding the grid */}
        <g transform="translate(452, 232)">
          <line x1="14" y1="18" x2="14" y2="72" stroke={purple} strokeWidth="3" strokeLinecap="round" />
          <g transform="rotate(-18 14 18)">
            <rect x="-16" y="0" width="60" height="26" rx="4" fill={purple} opacity="0.85" />
            <line x1="-16" y1="13" x2="44" y2="13" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.5" />
            <line x1="4" y1="0" x2="4" y2="26" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
            <line x1="24" y1="0" x2="24" y2="26" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
          </g>
          <circle
            cx="14"
            cy="18"
            r="5"
            fill={purple}
            style={{ animation: "float-y 2.6s ease-in-out infinite", transformOrigin: "14px 18px" }}
          />
        </g>

        {/* The network: farm -> store -> market, with a branch to transport */}
        <g fill="none" strokeLinecap="round">
          <path
            id="ga-link-1"
            d="M118 316 C 150 250, 236 250, 268 288"
            stroke={green}
            strokeWidth="2.5"
            strokeDasharray="10 12"
            opacity="0.85"
          />
          <path
            id="ga-link-2"
            d="M300 286 C 350 250, 404 214, 452 196"
            stroke={blue}
            strokeWidth="2.5"
            strokeDasharray="10 12"
            opacity="0.85"
          />
          <path
            id="ga-link-3"
            d="M132 330 C 214 372, 316 366, 392 332"
            stroke={amber}
            strokeWidth="2.5"
            strokeDasharray="10 12"
            opacity="0.8"
          />
        </g>

        {/* Packets travelling the network */}
        <circle r="4.5" fill={green}>
          <animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto">
            <mpath href="#ga-link-1" xlinkHref="#ga-link-1" />
          </animateMotion>
        </circle>
        <circle r="4" fill={blue}>
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="0.9s" rotate="auto">
            <mpath href="#ga-link-2" xlinkHref="#ga-link-2" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill={amber}>
          <animateMotion dur="4.4s" repeatCount="indefinite" begin="1.8s" rotate="auto">
            <mpath href="#ga-link-3" xlinkHref="#ga-link-3" />
          </animateMotion>
        </circle>

        {/* Nodes: farm, cold store, market, truck */}
        <g transform="translate(112, 300)">
          <rect x="-20" y="-26" width="40" height="30" rx="5" fill={green} />
          <path d="M-26 -26 L 0 -46 L 26 -26 Z" fill={green} opacity="0.75" />
          <rect x="-6" y="-14" width="12" height="18" rx="2" fill="#ffffff" opacity="0.85" />
        </g>

        <g transform="translate(284, 288)">
          <rect x="-22" y="-22" width="44" height="28" rx="5" fill={blue} />
          <path d="M-22 -22 L -12 -32 L 12 -32 L 22 -22 Z" fill={blue} opacity="0.7" />
          <circle cx="-10" cy="-6" r="3" fill="#ffffff" opacity="0.8" />
          <circle cx="10" cy="-6" r="3" fill="#ffffff" opacity="0.8" />
        </g>

        <g transform="translate(456, 188)">
          <rect x="-20" y="-20" width="40" height="26" rx="5" fill={purple} />
          <path d="M-20 -20 L -20 -32 L 4 -32 L 14 -20 Z" fill={purple} opacity="0.7" />
          <rect x="-13" y="-12" width="26" height="9" rx="2" fill="#ffffff" opacity="0.7" />
        </g>

        <g transform="translate(398, 328)">
          <rect x="-26" y="-12" width="34" height="18" rx="4" fill={amber} />
          <path d="M8 -12 L 20 -12 L 26 -2 L 8 -2 Z" fill={amber} opacity="0.8" />
          <circle cx="-16" cy="8" r="6" fill="#0f1b14" opacity="0.75" />
          <circle cx="14" cy="8" r="6" fill="#0f1b14" opacity="0.75" />
        </g>

        {/* Yield reading, floating over the field */}
        <g transform="translate(96, 148)">
          <rect x="-4" y="-4" width="118" height="46" rx="12" fill="#0f1b14" opacity="0.88" />
          <rect x="8" y="8" width="16" height="4" rx="2" fill={green} />
          <rect x="8" y="18" width="34" height="4" rx="2" fill="#ffffff" opacity="0.35" />
          <rect x="48" y="18" width="22" height="4" rx="2" fill={green} />
          <rect x="8" y="28" width="26" height="4" rx="2" fill="#ffffff" opacity="0.2" />
          <rect x="38" y="28" width="18" height="4" rx="2" fill={amber} />
        </g>
      </g>

      <rect
        x="1"
        y="1"
        width="558"
        height="438"
        rx="29"
        fill="none"
        stroke={green}
        strokeOpacity="0.28"
        strokeWidth="2"
      />
    </svg>
  );
}
