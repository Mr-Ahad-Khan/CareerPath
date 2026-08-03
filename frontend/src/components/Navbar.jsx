import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Compass, Users, Target, FileText, BarChart3, BookOpen } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Avatar } from './Avatar.jsx';
import { useAuth } from '@/lib/auth.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/simulate', label: 'Simulate', icon: Compass },
  { to: '/mentors', label: 'Mentors', icon: Users },
  { to: '/milestones', label: 'Milestones', icon: Target },
  { to: '/resume-check', label: 'Resume Check', icon: FileText },
  { to: '/how-it-works', label: 'How it works', icon: BookOpen },
];

const adminItem = { to: '/admin', label: 'Analytics', icon: BarChart3 };

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const items = user
    ? [...navItems, ...(user.role === 'admin' ? [adminItem] : [])]
    : [];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-xl'
          : 'border-transparent bg-background/40 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={user ? '/dashboard' : '/'} className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        {user && (
          <div className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface-2 hover:text-foreground'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 py-1 pl-1 pr-3">
                <Avatar name={user.name} color={user.avatarColor} size={28} />
                <span className="text-sm font-medium text-foreground">{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-ghost h-9 w-9 px-0"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </div>
          )}

          {user && (
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </nav>

      {user && mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden animate-fade-in-flat">
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface-2'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
