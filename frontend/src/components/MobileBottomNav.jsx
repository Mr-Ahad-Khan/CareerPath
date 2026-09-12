import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Target,
  Users,
  MoreHorizontal,
  FileText,
  BarChart3,
  BookOpen,
  LogOut,
  X,
  Coins,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/auth.jsx';
import { useCurrency } from '@/lib/currency.jsx';
import { Avatar } from './Avatar.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

export function MobileBottomNav() {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setMoreOpen(false);
    await logout();
    navigate('/');
  };

  const primaryItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/simulate', label: 'Simulate', icon: Compass },
    { to: '/milestones', label: 'Milestones', icon: Target },
    { to: '/mentors', label: 'Mentors', icon: Users },
  ];

  const secondaryItems = [
    { to: '/resume-check', label: 'Resume Reality-Check', icon: FileText, desc: 'Analyze skills against simulation' },
    { to: '/analytics', label: 'Market & Cohort Trends', icon: BarChart3, desc: 'Demand statistics and salary insights' },
    { to: '/how-it-works', label: 'How it Works', icon: BookOpen, desc: 'About the simulation model' },
  ];

  const isMoreActive =
    moreOpen ||
    secondaryItems.some((item) => location.pathname.startsWith(item.to));

  return (
    <>
      {/* Docked Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden pb-safe transition-all duration-300 shadow-lift"
      >
        <div className="flex h-16 items-center justify-around px-2">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  `group relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all duration-200 ${
                    isActive ? 'text-accent' : 'text-muted hover:text-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`flex h-8 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                        isActive ? 'bg-accent/15 scale-105' : 'group-active:scale-95'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-0.5 text-[10px] font-medium tracking-tight ${
                        isActive ? 'font-semibold text-accent' : 'text-muted'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* More Sheet Trigger */}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            aria-label="More navigation options"
            className={`group relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all duration-200 ${
              isMoreActive ? 'text-accent' : 'text-muted hover:text-foreground'
            }`}
          >
            <div
              className={`flex h-8 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                isMoreActive ? 'bg-accent/15 scale-105' : 'group-active:scale-95'
              }`}
            >
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span
              className={`mt-0.5 text-[10px] font-medium tracking-tight ${
                isMoreActive ? 'font-semibold text-accent' : 'text-muted'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Bottom Sheet for Additional Items */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in-flat"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="surface-card max-h-[85vh] w-full rounded-b-none rounded-t-3xl border-t border-border p-5 pb-safe overflow-y-auto touch-scroll shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />

            {/* Profile Header */}
            <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} color={user.avatarColor} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Links List */}
            <div className="space-y-1.5">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                      isActive
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-foreground hover:bg-surface-2'
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-muted'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none">{item.label}</p>
                      <p className="mt-1 truncate text-xs text-muted">{item.desc}</p>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* Settings and Actions Row */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
              {/* Currency Selector */}
              <button
                type="button"
                onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 p-2.5 text-xs font-medium text-foreground hover:border-accent/40"
              >
                <Coins className="h-4 w-4 text-accent" />
                <span>Currency: <b>{currency}</b></span>
              </button>

              {/* Theme Toggle */}
              <div className="flex items-center justify-center rounded-xl border border-border bg-surface-2 p-2 text-xs font-medium text-foreground">
                <span className="mr-2 text-muted">Theme:</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-error/10 p-3 text-sm font-medium text-error transition-colors hover:bg-error/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileBottomNav;
