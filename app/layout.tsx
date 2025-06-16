import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MB Smart Coach',
  description: 'Mercedes-Benz Smart Coach - Your Smart Charging Companion',
  generator: 'MB Smart Coach',
  icons: {
    icon: '/icons/mercedes-star.svg',
    shortcut: '/icons/mercedes-star.svg',
    apple: '/icons/mercedes-star.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
