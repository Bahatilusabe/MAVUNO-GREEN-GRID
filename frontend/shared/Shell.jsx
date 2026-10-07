import { useEffect, useState } from "react";
import {
  Bell,
  Bot,
  CircleHelp,
  Menu,
  Shuffle,
  Sprout,
  X,
} from "lucide-react";

export default function Shell({ 
  nav, 
  active, 
  onNavigate, 
  title, 
  subtitle, 
  user, 
  alerts = 0, 
  actions, 
  onBell, 
  aside, 
  children 
}) {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(false);
  
  const pick = (key) => { 
    setOpen(false); 
    onNavigate(key); 
  };

  useEffect(() => {
    if (!chat) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setChat(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chat]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row relative text-gray-900 font-sans">
      
      {/* Mobile Backdrop Scrim for Sidebar */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity" 
          onClick={() => setOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-label="Main"
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-sidebar-border flex items-center gap-3">
          <div className="p-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-xl shadow-2xs">
            <Sprout aria-hidden="true" size={24} />
          </div>
          <div>
            <strong className="text-base font-bold tracking-tight text-sidebar-foreground block leading-tight">MAVUNO</strong>
            <small className="text-xs text-sidebar-primary-foreground font-semibold uppercase tracking-wider block">Green Grid</small>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map(([key, label, Icon, badge]) => {
            const isActive = active === key;
            return (
              <button 
                key={key} 
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                aria-current={isActive ? "page" : undefined} 
                onClick={() => pick(key)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon aria-hidden="true" size={18} className={isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70"} />
                  <span className="truncate">{label}</span>
                </div>

                {badge === true && (
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-sidebar-primary-foreground" : "bg-sidebar-primary"}`} />
                )}
                {typeof badge === "number" && badge > 0 && (
                  <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                    isActive ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground" : "bg-sidebar-accent text-sidebar-accent-foreground"
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}

          <a 
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all mt-4" 
            href="#/"
          >
            <Shuffle aria-hidden="true" size={18} className="text-sidebar-foreground/70" /> Switch view
          </a>
        </div>

        {/* Sidebar User Profile Footer */}
        {user && (
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-bold flex items-center justify-center text-xs shadow-2xs flex-shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="text-xs sm:text-sm font-bold text-sidebar-foreground block truncate">{user.name}</strong>
              <small className="text-[11px] text-sidebar-foreground/70 font-medium block truncate">{user.sub}</small>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl lg:hidden transition-colors cursor-pointer" 
              aria-label="Menu" 
              onClick={() => setOpen(!open)}
            >
              <Menu aria-hidden="true" size={20} />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-snug">{title}</h1>
              {subtitle && <p className="text-xs text-gray-500 font-medium hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {actions}

            {/* Notification Bell */}
            <button 
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl relative transition-colors cursor-pointer" 
              aria-label="Notifications" 
              onClick={onBell}
            >
              <Bell aria-hidden="true" size={18} />
              {alerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-2xs">
                  {alerts}
                </span>
              )}
            </button>

            {/* Help Button */}
            <button 
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer hidden sm:block" 
              aria-label="Help"
            >
              <CircleHelp aria-hidden="true" size={18} />
            </button>

            {/* Top User Avatar */}
            {user && (
              <div className="w-9 h-9 rounded-full bg-green-700 text-white font-bold flex items-center justify-center text-xs shadow-2xs flex-shrink-0 ml-1">
                {user.initials}
              </div>
            )}
          </div>
        </header>

        {/* Page Content Container */}
        <section className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </section>
      </main>

      {/* Floating AI Assistant / Aside Drawer */}
      {aside && (
        <>
          {/* Floating Action Button */}
          <button 
            className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-brand-700 hover:bg-brand-800 text-primary-foreground px-5 py-3 rounded-full shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 cursor-pointer"
            aria-label="Ask MAVUNO AI"
            onClick={() => setChat(true)}
          >
            <span className="relative flex items-center justify-center" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
              <Bot size={20} className="relative z-10" />
            </span>
            <span className="font-semibold text-sm tracking-wide pr-1">Ask MAVUNO AI</span>
          </button>

          {/* Assistant Slide-over Drawer */}
          <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[30rem] max-w-[92vw] bg-white border-l border-gray-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            chat ? "translate-x-0" : "translate-x-full"
          }`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <strong className="text-sm font-bold text-gray-900">AI Assistant</strong>
              <button 
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer" 
                aria-label="Close assistant" 
                onClick={() => setChat(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {aside}
            </div>
          </div>

          {/* Assistant Backdrop Scrim */}
          {chat && (
            <div 
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity" 
              aria-label="Close AI assistant" 
              onClick={() => setChat(false)} 
            />
          )}
        </>
      )}
    </div>
  );
}