import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Compass,
  Target,
  FileText,
  BarChart3,
  BookOpen,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  WifiOff,
  Coins,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Logo } from './Logo.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Avatar } from './Avatar.jsx';
import { OfflineBanner } from './OfflineBanner.jsx';
import { useAuth } from '@/lib/auth.jsx';
import { useCurrency } from '@/lib/currency.jsx';

// Core items displayed on medium-to-large displays (>= 1024px)
const coreNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/simulate', label: 'Simulate', icon: Compass },
  { to: '/milestones', label: 'Milestones', icon: Target },
  {
    to: '/mentors',
    label: 'Mentors & Chat',
    shortLabel: 'Mentors',
    icon: MessageSquare,
    hasBadge: true,
  },
];

// Extended items displayed on wide screens (>= 1280px), folded into "More" on 1024px-1279px
const extendedNavItems = [
  {
    to: '/resume-check',
    label: 'Resume Check',
    desc: 'Match resume to skill gaps',
    icon: FileText,
  },
  {
    to: '/analytics',
    label: 'Analytics',
    desc: 'Market trends & cohort insights',
    icon: BarChart3,
  },
];

// Secondary educational items inside the "More" dropdown
const secondaryNavItems = [
  {
    to: '/how-it-works',
    label: 'How it Works',
    desc: 'Methodology & scoring logic',
    icon: BookOpen,
  },
  {
    to: '/calculation-proof',
    label: 'Calculation Proof',
    desc: 'Rules engine & math formulas',
    icon: ShieldCheck,
  },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isXl, setIsXl] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : true
  );

  const [navHeight, setNavHeight] = useState(0);
  const headerRef = useRef(null);
  const navContainerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsXl(window.innerWidth >= 1280);
      if (headerRef.current) {
        setNavHeight(headerRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserDropdownOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns and mobile drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  const isMoreActive =
    secondaryNavItems.some((item) => location.pathname.startsWith(item.to)) ||
    (!isXl && extendedNavItems.some((item) => location.pathname.startsWith(item.to)));

  // Friendly display name that avoids awkward "Offline" first name
  const rawFirstName = user?.name ? user.name.split(' ')[0] : 'Member';
  const displayName =
    user?.isOffline || rawFirstName.toLowerCase() === 'offline'
      ? 'Explorer'
      : rawFirstName;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 border-b pt-safe transition-colors duration-200 ${
          scrolled
            ? 'border-border/80 bg-background/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'border-border/40 bg-background/85 backdrop-blur-md'
        }`}
      >
        {/* Subtle top ambient hairline glow */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/35 to-transparent pointer-events-none" />

        <OfflineBanner />

        <nav
          ref={navContainerRef}
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 lg:px-6 relative"
        >
          {/* Left: Brand Logo */}
          <div className="flex items-center justify-start shrink-0">
            <Link
              to={user ? '/dashboard' : '/'}
              className="group flex items-center transition-transform duration-150 active:scale-95 shrink-0"
              aria-label="CareerPath Home"
            >
              <Logo />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Responsive between lg and xl) */}
          <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 shrink min-w-0">
            {user ? (
              <>
                {/* Core Items: always visible on lg+ */}
                {coreNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-1.5 rounded-lg px-2 lg:px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-medium whitespace-nowrap transition-all duration-150 ${
                        isActive
                          ? 'bg-accent/15 text-accent font-semibold shadow-xs ring-1 ring-accent/30'
                          : 'text-muted hover:bg-surface-2/80 hover:text-foreground'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110" />
                    <span>
                      {item.shortLabel ? (
                        <>
                          <span className="xl:hidden">{item.shortLabel}</span>
                          <span className="hidden xl:inline">{item.label}</span>
                        </>
                      ) : (
                        item.label
                      )}
                    </span>
                    {item.hasBadge && (
                      <span className="relative flex h-2 w-2 shrink-0 ml-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                  </NavLink>
                ))}

                {/* Extended Items: visible on xl+, moved into "More" on lg to prevent overflow */}
                {extendedNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group relative hidden xl:flex items-center gap-1.5 rounded-lg px-2.5 xl:px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-all duration-150 ${
                        isActive
                          ? 'bg-accent/15 text-accent font-semibold shadow-xs ring-1 ring-accent/30'
                          : 'text-muted hover:bg-surface-2/80 hover:text-foreground'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                {/* "More" Resources Dropdown */}
                <div className="relative" ref={moreDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setMoreDropdownOpen((prev) => !prev)}
                    className={`flex items-center gap-1 rounded-lg px-2 lg:px-2.5 py-1.5 text-xs xl:text-[13px] font-medium whitespace-nowrap transition-all duration-150 ${
                      isMoreActive || moreDropdownOpen
                        ? 'bg-surface-2 text-foreground font-semibold shadow-xs ring-1 ring-border'
                        : 'text-muted hover:bg-surface-2/80 hover:text-foreground'
                    }`}
                    aria-expanded={moreDropdownOpen}
                  >
                    <span>More</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        moreDropdownOpen ? 'rotate-180 text-foreground' : 'text-muted'
                      }`}
                    />
                  </button>

                  {moreDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-border bg-surface/95 p-1.5 shadow-lift backdrop-blur-xl animate-fade-in z-50">
                      {/* Show extended items in dropdown on lg screens */}
                      <div className="xl:hidden">
                        <div className="px-2.5 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                          Key Features
                        </div>
                        {extendedNavItems.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMoreDropdownOpen(false)}
                            className={({ isActive }) =>
                              `flex items-start gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors duration-150 ${
                                isActive
                                  ? 'bg-accent/10 text-accent font-semibold'
                                  : 'text-muted hover:bg-surface-2 hover:text-foreground'
                              }`
                            }
                          >
                            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            <div>
                              <div className="font-medium text-foreground">{item.label}</div>
                              <div className="text-[11px] text-muted">{item.desc}</div>
                            </div>
                          </NavLink>
                        ))}
                        <div className="my-1.5 border-t border-border/60" />
                        <div className="px-2.5 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                          Resources
                        </div>
                      </div>

                      {secondaryNavItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={({ isActive }) =>
                            `flex items-start gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors duration-150 ${
                              isActive
                                ? 'bg-accent/10 text-accent font-semibold'
                                : 'text-muted hover:bg-surface-2 hover:text-foreground'
                            }`
                          }
                        >
                          <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <div>
                            <div className="font-medium text-foreground">{item.label}</div>
                            <div className="text-[11px] text-muted">{item.desc}</div>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <NavLink
                  to="/how-it-works"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-muted hover:bg-surface-2/80 hover:text-foreground'
                    }`
                  }
                >
                  <BookOpen className="h-3.5 w-3.5 text-accent" />
                  <span>How It Works</span>
                </NavLink>
                <NavLink
                  to="/calculation-proof"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-muted hover:bg-surface-2/80 hover:text-foreground'
                    }`
                  }
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  <span>Calculation Proof</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Right Actions: Currency Toggle, Theme, Profile / Auth, Mobile Menu */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Currency Switcher (tablet/desktop) */}
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border/80 bg-surface-2/60 px-2 py-1 text-xs font-semibold text-muted hover:text-accent hover:border-accent/40 transition-all duration-150"
              title="Toggle Currency (INR ₹ / USD $)"
              aria-label="Toggle Currency"
            >
              <span className="font-bold text-accent">{currency === 'INR' ? '₹' : '$'}</span>
              <span>{currency}</span>
            </button>

            <ThemeToggle />

            {user ? (
              /* Logged-In User Profile Menu */
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/80 bg-surface-2/60 hover:bg-surface-2 p-1 pr-2 sm:pr-2.5 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 shrink-0"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="relative shrink-0">
                    <Avatar name={user.name} color={user.avatarColor} size={28} />
                    {user.isOffline && (
                      <span className="absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full bg-amber-400 ring-2 ring-background" />
                    )}
                  </div>
                  <span className="hidden md:inline-block text-xs font-semibold text-foreground max-w-[70px] lg:max-w-[90px] xl:max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 text-muted transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-surface/95 p-2 shadow-lift backdrop-blur-xl animate-fade-in z-50">
                    {/* Profile Header */}
                    <div className="flex items-center gap-3 rounded-xl bg-surface-2/70 p-3 mb-1">
                      <Avatar name={user.name} color={user.avatarColor} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-muted truncate">
                          {user.isOffline ? (
                            <span className="inline-flex items-center gap-1 text-amber-400">
                              <WifiOff className="h-3 w-3" /> Offline / Guest
                            </span>
                          ) : (
                            user.email || 'Member'
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links inside User Menu */}
                    <div className="flex flex-col py-1 border-y border-border/60">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-accent" />
                        <span>Dashboard Overview</span>
                      </Link>
                      <Link
                        to="/simulate"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <Compass className="h-3.5 w-3.5 text-accent" />
                        <span>Simulation Studio</span>
                      </Link>
                      <Link
                        to="/milestones"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <Target className="h-3.5 w-3.5 text-accent" />
                        <span>Roadmap Milestones</span>
                      </Link>
                      <Link
                        to="/analytics"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                      >
                        <BarChart3 className="h-3.5 w-3.5 text-accent" />
                        <span>Market & Cohort Trends</span>
                      </Link>
                    </div>

                    {/* Currency Switcher in Dropdown */}
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-muted">
                      <span>Active Currency</span>
                      <button
                        onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                        className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                      >
                        {currency === 'INR' ? '₹ INR (India)' : '$ USD (Global)'}
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-1 border-t border-border/60">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Visitor Auth CTA */
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                  to="/login"
                  className="btn-ghost hidden sm:inline-flex text-xs px-2.5 sm:px-3 py-1.5 sm:py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 inline-flex items-center gap-1 sm:gap-1.5 shadow-xs"
                >
                  <span>Get started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile / Tablet Menu Hamburger Button (shown on < lg) */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-surface-2/60 text-muted hover:text-foreground hover:bg-surface-2 lg:hidden transition-colors shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile / Tablet Drawer Panel */}
        {mobileOpen && (
          <div className="border-t border-border/80 bg-background/95 backdrop-blur-xl px-4 py-4 lg:hidden animate-fade-in shadow-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
            {user ? (
              <>
                {/* User Status Bar */}
                <div className="flex items-center justify-between rounded-xl bg-surface-2/80 p-3 mb-3 border border-border/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={user.name} color={user.avatarColor} size={34} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-muted truncate">
                        {user.isOffline ? 'Offline / Guest Mode' : user.email || 'Member'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                    className="shrink-0 rounded-lg border border-border bg-surface px-2 py-1 text-[11px] font-semibold text-accent"
                  >
                    {currency === 'INR' ? '₹ INR' : '$ USD'}
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1">
                  <div className="px-2 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Main Menu
                  </div>
                  {[...coreNavItems, ...extendedNavItems].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-accent/15 text-accent font-semibold'
                            : 'text-muted hover:bg-surface-2 hover:text-foreground'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.hasBadge && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          Live
                        </span>
                      )}
                    </NavLink>
                  ))}

                  <div className="mt-2 px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted border-t border-border/50">
                    Resources & Methodology
                  </div>
                  {secondaryNavItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-accent/15 text-accent font-semibold'
                            : 'text-muted hover:bg-surface-2 hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 text-accent" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}

                  <div className="mt-3 pt-2 border-t border-border/60">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-error/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Logged-Out Visitor Drawer */
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-border/60">
                  <span className="text-xs font-medium text-muted">Currency</span>
                  <button
                    onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                    className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs font-semibold text-accent"
                  >
                    <Coins className="h-3.5 w-3.5" />
                    <span>{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1 py-1">
                  <NavLink
                    to="/how-it-works"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-accent/15 text-accent font-semibold'
                          : 'text-muted hover:bg-surface-2 hover:text-foreground'
                      }`
                    }
                  >
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span>How It Works</span>
                  </NavLink>
                  <NavLink
                    to="/calculation-proof"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-accent/15 text-accent font-semibold'
                          : 'text-muted hover:bg-surface-2 hover:text-foreground'
                      }`
                    }
                  >
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Calculation Proof</span>
                  </NavLink>
                </div>

                <div className="mt-2 pt-3 border-t border-border/60 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2/80 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-surface-2"
                  >
                    <LogIn className="h-4 w-4 text-accent" />
                    <span>Sign in to account</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5 shadow-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create free account</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Dynamic spacer to keep page content beneath fixed navbar */}
      <div
        style={navHeight ? { height: `${navHeight}px` } : undefined}
        className="h-16 pt-safe pointer-events-none select-none"
        aria-hidden="true"
      />
    </>
  );
}

export default Navbar;
