const DEFAULT_WORDS = ["farms", "crops", "markets", "weather", "impact"];

export default function Loader({
  words = DEFAULT_WORDS,
  label = "Loading",
  className = "",
}) {
  const rotatingWords = words.length > 1 ? [...words, words[0]] : words;

  return (
    <div className={`system-loader ${className}`.trim()} role="status" aria-live="polite">
      <div className="system-loader__card">
        <div className="system-loader__content">
          <span className="system-loader__label">{label}</span>
          <span className="system-loader__words" aria-hidden="true">
            {rotatingWords.map((word, index) => (
              <span className="system-loader__word" key={`${word}-${index}`}>
                {word}
              </span>
            ))}
          </span>
          <span className="sr-only">{label} {words.join(", ")}</span>
        </div>
      </div>
    </div>
  );
}
