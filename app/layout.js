import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LOL MAD MOVIE',
  description: '칼바람 하이라이트',
  openGraph: {
    title: 'LOL MAD MOVIE',
    description: '칼바람 하이라이트',
    siteName: 'LOL MAD MOVIE',
    // images: [
    //   {
    //     url: './ARAM.png',
    //     width: 800,
    //     height: 600,
    //   }]
    }
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>
        <Navigation />
        {children}
        </body>
    </html>
  )
}
