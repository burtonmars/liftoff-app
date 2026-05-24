import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Liftoff',
  description: 'Drop the weight. Do the thing.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Liftoff',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAFAF8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-180.png" />
      </head>
      <body>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
