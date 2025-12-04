import { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className={cn('flex min-h-screen flex-col', 'lg:ml-64')}>
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
