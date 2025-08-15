'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, FileText, Map, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const FooterItem = ({ icon: Icon, label, path }: { icon: React.ElementType; label: string; path: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === path;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-16 p-2 cursor-pointer transition-colors',
        isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
      )}
      onClick={() => router.push(path)}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};

export const HindalcoFooter = () => {
  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Permits', href: '/permits', icon: FileText },
    { label: 'Map', href: '/map', icon: Map },
    { label: 'Account', href: '#', icon: User },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-card shadow-[0_-2px_5px_rgba(0,0,0,0.05)] z-50 border-t">
      <div className="grid grid-cols-4">
        {navItems.map(item => (
            <FooterItem key={item.label} icon={item.icon} label={item.label} path={item.href} />
        ))}
      </div>
    </footer>
  );
};
