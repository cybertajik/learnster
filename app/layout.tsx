import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Spanishly - Modern Spanish Vocabulary Learning',
  description:
    'Master Spanish vocabulary with smart visual flashcards, Pexels image search, progress tracking, and spaced repetition queue.',
  keywords: [
    'Spanish',
    'Vocabulary',
    'Learn Spanish',
    'Flashcards',
    'Pexels',
    'A1',
    'A2',
    'Spanishly',
  ],
  authors: [{ name: 'Spanishly Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
