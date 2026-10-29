import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'E-Shop — Premium Online Shopping',
  description: 'Shop the latest electronics, accessories, apparel, home goods, and more with fast and secure shipping.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased font-sans">
        <Providers>
          {/* Main Navigation */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1">{children}</main>

          {/* E-Commerce Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
