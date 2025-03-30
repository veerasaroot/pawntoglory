import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ChessLayoutProps {
  children: ReactNode;
  showHero?: boolean;
  title?: string;
  subtitle?: string;
}

export default function ChessLayout({ 
  children, 
  showHero = false, 
  title = "Pawn to Glory", 
  subtitle = "การแข่งขันหมากรุกออนไลน์สำหรับทุกระดับฝีมือ" 
}: ChessLayoutProps) {
  return (
    <div className="min-h-screen bg-chess-bg text-chess-text font-sans">
      {/* Navigation */}
      <nav className="bg-chess-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="h-10 w-10 relative mr-2">
                  <Image 
                    src="/images/pawn-logo.svg"
                    alt="Pawn to Glory Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-chess-gold font-serif text-xl font-bold">Pawn to Glory</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-chess-black hover:text-chess-white transition-colors">
                หน้าแรก
              </Link>
              <Link href="/tournaments" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-chess-black hover:text-chess-white transition-colors">
                การแข่งขัน
              </Link>
              <Link href="/admin/login" className="px-3 py-2 text-sm font-medium bg-chess-gold hover:bg-chess-bronze text-chess-dark rounded-md transition-colors">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {showHero && (
        <div className="bg-hero-pattern bg-cover bg-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold font-serif text-chess-gold mb-4">{title}</h1>
              <p className="text-xl md:text-2xl text-chess-text-muted mb-8">{subtitle}</p>
              <div className="flex justify-center space-x-4">
                <button className="bg-chess-gold hover:bg-chess-bronze text-chess-dark px-6 py-3 rounded-chess font-medium transition-colors shadow-chess hover:shadow-chess-hover">
                  ลงทะเบียนเข้าร่วม
                </button>
                <button className="bg-transparent hover:bg-chess-black text-chess-gold border-2 border-chess-gold px-6 py-3 rounded-chess font-medium transition-colors">
                  รายละเอียดเพิ่มเติม
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-chess-dark py-8 border-t border-chess-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 relative mr-2">
                  <Image 
                    src="/images/pawn-logo.svg"
                    alt="Pawn to Glory Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-chess-gold font-serif text-lg font-bold">Pawn to Glory</span>
              </div>
              <p className="text-chess-text-muted text-sm mt-1">© {new Date().getFullYear()} ขอบคุณที่ร่วมแข่งขันกับเรา</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-chess-text-muted hover:text-chess-gold transition-colors">
                เกี่ยวกับเรา
              </a>
              <a href="#" className="text-chess-text-muted hover:text-chess-gold transition-colors">
                กฎกติกา
              </a>
              <a href="#" className="text-chess-text-muted hover:text-chess-gold transition-colors">
                ติดต่อเรา
              </a>
              <a href="#" className="text-chess-text-muted hover:text-chess-gold transition-colors">
                นโยบายความเป็นส่วนตัว
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}