import { Button } from '@/components/ui/button';
import { Menu, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-white/5 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>

        {/* Breadcrumb / Page Title */}
        <div className="flex-1 px-4">
          <h2 className="text-lg font-semibold text-foreground">Welcome</h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <Link to="/login">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
