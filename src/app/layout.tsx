import type { Metadata } from 'next';
import './globals.css';
import DemoBanner from '@/components/DemoBanner';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'AI Agent Orchestration Dashboard',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-mc-bg text-mc-text min-h-screen">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
