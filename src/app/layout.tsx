import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import Providers from '@/components/Providers';

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
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased">
        <Providers>
          {/* Top Announcement */}
          <AnnouncementBar />

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
