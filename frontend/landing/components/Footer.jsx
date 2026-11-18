import { FOOTER_LINKS } from "../data";

/** Read once at module scope: the year must not change between renders. */
const YEAR = new Date().getFullYear();

/**
 * The footer.
 *
 * Deliberately quiet: the page's last job is to get the reader into the
 * product, not to compete with the hero for attention.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                  <path d="M12 21c0-6 3.5-9.5 9-11-1 6-4 9.5-9 11Z" fill="currentColor" opacity=".95" />
                  <path
                    d="M12 21C8 21 4 17 4 11c4 0 7 2 8 6 .8-3 2-4.5 4-5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="leading-tight">
                <strong className="block text-sm font-extrabold tracking-tight text-foreground">MAVUNO</strong>
                <small className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Green Grid
                </small>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A shared network for Kenyan agriculture — sensing every plot, forecasting every harvest,
              and matching supply to demand before produce is loaded.
            </p>
          </div>

          {FOOTER_LINKS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            © {YEAR} MAVUNO Green Grid. A prototype for Kenyan smallholder agriculture.
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            Built with satellite sensing, weather data and a lot of coffee.
          </p>
        </div>
      </div>
    </footer>
  );
}
