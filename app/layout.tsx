import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lernster - Modern Spanish Vocabulary & Sentence Learning',
  description:
    'Master Spanish vocabulary and conversational sentences with Lernster - featuring smart spaced repetition, interactive mascot feedback, audio pronunciations, and visual flashcards.',
  keywords: [
    'Spanish',
    'Vocabulary',
    'Learn Spanish',
    'Flashcards',
    'Sentences',
    'A1',
    'A2',
    'B1',
    'B2',
    'Lernster',
  ],
  authors: [{ name: 'Lernster Team' }],
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
