import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Workspace | Personal Dashboard',
  description: 'Personal productivity dashboard',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#050505',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <div className="orb orb-1" id="orb1"></div>
        <div className="orb orb-2" id="orb2"></div>
        {children}
      </body>
    </html>
  )
}
