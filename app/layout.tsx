import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather Forecast App',
  description: 'Real-time weather forecasting application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

