import { Inter } from 'next/font/google'
import StyledComponentsRegistry from '@/app/antd-registry'
import Footer from '@/app/_components/Footer'
import IconBackground from '@/app/_components/IconBackground/IconBackground'
import './globals.css'
import Icon from '@ant-design/icons/lib/components/Icon'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Wishlist 🎁',
  description: 'What do you wish?',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <IconBackground />
          <main>
            {children}
            <Footer />
          </main>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
