'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BarChart2, Settings as SettingsIcon, LogOut } from 'lucide-react';
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

  const isDemo = !!user?.isDemo;

  const navLinks = isDemo
    ? [{ href: '/', label: 'Learn', icon: BookOpen }]
    : [
        { href: '/', label: 'Learn', icon: BookOpen },
        { href: '/progress', label: 'Progress', icon: BarChart2 },
        { href: '/settings', label: 'Settings', icon: SettingsIcon },
      ];

  const mascotSrc = getMascotImagePath(mascotExpression);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Merged Single Top Bar: Bigger Mascot Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group" title="Lernster">
          <div className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 sm:border-3 border-amber-400 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform bg-amber-100 shrink-0">
            <img
              src={mascotSrc}
              alt="Mascot Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
          {isDemo && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-500 border border-amber-400/40">
              Demo
            </span>
          )}
        </Link>

        {/* Navigation Items in ONE Merged Top Bar: Learn | Progress | Settings */}
        <nav className="flex items-center gap-0.5 sm:gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200 dark:border-slate-700/60 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
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
              logoutUser(isDemo);
              if (onLogout) onLogout();
              window.location.reload();
            }}
            className="p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700/80 transition-colors shrink-0"
            title={isDemo ? 'Exit Demo' : 'Log Out'}
          >
            <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        )}
      </div>
    </header>
  );
};
