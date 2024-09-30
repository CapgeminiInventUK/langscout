import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/app/providors';
import React from 'react';
import AppBar from '@/components/global/app-bar/app-bar';


export const metadata: Metadata = {
  title: 'Langscout',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppBar/>
          <main className={'max-w-full flex justify-center'}>
            <div className="px-4 pt-4 w-full max-w-screen-2xl">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
