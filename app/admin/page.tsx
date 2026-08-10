'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LoginScreen } from '@/components/LoginScreen';
import { getCurrentUser, getAdminUsersList, UserProfile, AdminUserRecord } from '@/lib/auth';
import { getAdminGlobalAnalytics, loadUserSettings } from '@/lib/storage';
import {
  ShieldCheck,
  Users,
  Target,
  CheckCircle2,
  XCircle,
  Laptop,
  Smartphone,
  Globe,
  Calendar,
  Layers,
  BookOpen,
  Zap,
} from 'lucide-react';

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalTries: 0,
    correctTries: 0,
    incorrectTries: 0,
    practicedWordsCount: 0,
  });

  const loadAdminData = async () => {
    const localUsers = getAdminUsersList();
    const analytics = getAdminGlobalAnalytics();

    let mergedUsers = [...localUsers];

    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.users && Array.isArray(data.users)) {
        const map: Record<string, AdminUserRecord> = {};

        localUsers.forEach((u) => {
          map[u.username.toLowerCase()] = u;
        });

        data.users.forEach((su: any) => {
          const key = su.username.toLowerCase();
          if (!map[key]) {
            map[key] = {
              username: su.username,
              name: su.name || su.username,
              created: su.created || new Date().toISOString(),
              device: su.device || 'Web Client',
              country: su.country || 'United States',
              countryFlag: su.countryFlag || '🇺🇸',
              ip: su.ip || '127.0.0.1',
              lastActive: su.created || new Date().toISOString(),
              totalTries: su.totalTries || 0,
              correctTries: su.correctTries || 0,
              incorrectTries: su.incorrectTries || 0,
            };
          } else {
            map[key].totalTries = Math.max(map[key].totalTries || 0, su.totalTries || 0);
            map[key].correctTries = Math.max(map[key].correctTries || 0, su.correctTries || 0);
            map[key].incorrectTries = Math.max(map[key].incorrectTries || 0, su.incorrectTries || 0);
          }
        });

        mergedUsers = Object.values(map);
      }
    } catch (e) {
      console.error('Error fetching API admin users:', e);
    }

    setUsersList(mergedUsers);

    let totalT = analytics.totalTries;
    let correctT = analytics.correctTries;
    let incorrectT = analytics.incorrectTries;

    mergedUsers.forEach((u) => {
      totalT = Math.max(totalT, u.totalTries || 0);
      correctT = Math.max(correctT, u.correctTries || 0);
      incorrectT = Math.max(incorrectT, u.incorrectTries || 0);
    });

    setGlobalStats({
      totalTries: totalT,
      correctTries: correctT,
      incorrectTries: incorrectT,
      practicedWordsCount: Object.keys(analytics.practicedWordIds || {}).length,
    });
  };

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setAuthChecked(true);

    if (user && user.isAdmin) {
      loadAdminData();
    }
  }, []);

  if (!authChecked) return null;

  // Protect Admin Dashboard: Prompt for admin login if user is not logged in or not admin
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="mb-4 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">System Admin Portal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Please log in with admin username (<code className="text-amber-300 font-mono">admin</code>) and admin password to access analytics.
          </p>
        </div>
        <LoginScreen onSuccess={(u) => {
          setCurrentUser(u);
          if (u.isAdmin) {
            loadAdminData();
          }
        }} />
      </div>
    );
  }

  const settings = loadUserSettings(currentUser.username);
  const totalUsersCount = usersList.length;
  const globalAccuracy =
    globalStats.totalTries > 0
      ? Math.round((globalStats.correctTries / globalStats.totalTries) * 100)
      : 0;

  const renderDeviceBadge = (device: string) => {
    const isMobile = /iPhone|Android/i.test(device);
    const Icon = isMobile ? Smartphone : Laptop;
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
        <Icon className="w-3.5 h-3.5 text-rose-500" />
        <span>{device}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar user={currentUser} settings={settings} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                System Admin Dashboard
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Real-time user registration tracking, device detection, IP geolocation, and cumulative lifetime analytics.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Admin Status: Active</span>
          </div>
        </div>

        {/* Top Lifetime Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Registered Users */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Users Registered
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalUsersCount}</h3>
            </div>
          </div>

          {/* Lifetime Question Tries */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Lifetime Total Tries
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {globalStats.totalTries}
              </h3>
            </div>
          </div>

          {/* Global Accuracy Rate */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Global Accuracy
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {globalAccuracy}%
              </h3>
            </div>
          </div>

          {/* Total Words & Sentences Dataset */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Flashcard Items
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">2,720</h3>
            </div>
          </div>
        </div>

        {/* Global Performance Summary Breakdown */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-500" />
            <span>Cumulative Lifetime Answer Statistics (Inviolable Permanent Record)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lifetime Correct</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {globalStats.correctTries}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lifetime Incorrect</span>
              </div>
              <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
                {globalStats.incorrectTries}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unique Practiced Items</span>
              </div>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {globalStats.practicedWordsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Registered Users Table */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Registered Users & Access Logs</span>
          </h3>

          {usersList.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              No registered user records logged yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="p-3.5 rounded-l-lg">User / Name</th>
                    <th className="p-3.5">Device Used</th>
                    <th className="p-3.5">Location (IP)</th>
                    <th className="p-3.5">Registered Date</th>
                    <th className="p-3.5">User Tries</th>
                    <th className="p-3.5 rounded-r-lg">Correct / Wrong</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {usersList.map((userRec) => (
                    <tr key={userRec.username} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {userRec.name}
                            {userRec.username === 'admin' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-extrabold uppercase border border-rose-500/30">
                                ADMIN
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">@{userRec.username}</span>
                        </div>
                      </td>
                      <td className="p-3.5">{renderDeviceBadge(userRec.device)}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg leading-none">{userRec.countryFlag || '🌐'}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                              {userRec.country || 'Unknown'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">{userRec.ip || '127.0.0.1'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(userRec.created).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {userRec.totalTries || 0}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ✓ {userRec.correctTries || 0}
                          </span>
                          <span className="text-slate-400">/</span>
                          <span className="text-rose-600 dark:text-rose-400">
                            ✕ {userRec.incorrectTries || 0}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
