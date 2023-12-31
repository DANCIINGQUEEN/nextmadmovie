import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/app/_components/Navigation'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  openGraph: {
    title: 'LOL MAD MOVIE',
    description: '칼바람 하이라이트',
    siteName: 'LOL MAD MOVIE',
    }
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navigation/>
        {children}
        </body>
    </html>
  )
}


