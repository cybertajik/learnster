'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BarChart2, Settings as SettingsIcon, LogOut, ShieldCheck } from 'lucide-react';
import { UserProgress, UserSettings } from '@/types/vocabulary';
import { UserProfile, logoutUser } from '@/lib/auth';
import { MascotExpression, getMascotImagePath } from '@/lib/mascot';

interface NavbarProps {
  user?: UserProfile | null;
  progress?: UserProgress;
  settings?: UserSettings;
  mascotExpression?: MascotExpression;
  onSettingsChange?: (newSettings: UserSettings) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  settings,
  mascotExpression = 'happy',
  onLogout,
}) => {
  const pathname = usePathname();
  const currentTheme = settings?.theme || 'dark';

  // Apply theme class to document root element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (currentTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, [currentTheme]);

  const navLinks = [
    { href: '/', label: 'Learn', icon: BookOpen },
    { href: '/progress', label: 'Progress', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (user?.isAdmin) {
    navLinks.push({ href: '/admin', label: 'Admin', icon: ShieldCheck });
  }

  const mascotSrc = getMascotImagePath(mascotExpression);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Merged Single Top Bar: Bigger Mascot Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group" title="Lernster">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 sm:border-3 border-amber-400 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform bg-amber-100 shrink-0">
            <img
              src={mascotSrc}
              alt="Mascot Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
        </Link>

        {/* Navigation Items in ONE Merged Top Bar: Learn | Progress | Settings */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200 dark:border-slate-700/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-900/30'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button in Single Merged Top Bar */}
        {user && (
          <button
            onClick={() => {
              logoutUser();
              if (onLogout) onLogout();
              window.location.reload();
            }}
            className="p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700/80 transition-colors shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        )}
      </div>
    </header>
  );
};
