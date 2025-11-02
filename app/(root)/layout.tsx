
import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from '../components/i18n-provider';
import Header from '@/components/shared/header';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Kissan',
  description: 'AI-Powered Farmer Support System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <I18nProvider>
          <Header />
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
