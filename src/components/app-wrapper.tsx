'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/context/user-context';
import { HindalcoHeader } from '@/components/hindalco-header';
import { HindalcoFooter } from '@/components/hindalco-footer';
import { Skeleton } from '@/components/ui/skeleton';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname.startsWith('/login');
    const isVisitorPage = pathname.startsWith('/visitor');

    if (user) {
      if (user.type === 'employee') {
        if (isAuthPage) router.push('/');
        if (isVisitorPage) router.push('/'); // Employees shouldn't be on visitor pages
      } else if (user.type === 'visitor') {
        if (isAuthPage) router.push('/visitor');
        if (!isVisitorPage && pathname !== '/') router.push('/visitor'); // Visitors should only be on their page or root
        if(pathname === '/') router.push('/visitor');
      }
    } else {
      // Not logged in
      if (!isAuthPage) {
        router.push('/login');
      }
    }
  }, [user, isLoading, pathname, router]);

  const noLayoutPages = ['/login', '/login/visitor'];

  if (noLayoutPages.includes(pathname)) {
    return <>{children}</>;
  }

  // Show a loading skeleton for the main layout while we check auth
  if (isLoading || !user) {
    return (
        <div className="relative flex flex-col min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground p-4 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-6 w-24 hidden md:block" />
                    </div>
                     <div className="hidden md:flex items-center space-x-1">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                     </div>
                     <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                     </div>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center">
            </main>
        </div>
    );
  }

  // Visitors get a different layout (no header/footer)
  if (user.type === 'visitor') {
    return (
       <div className="relative flex flex-col min-h-screen bg-gray-50">
         <main className="flex-grow">{children}</main>
       </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <HindalcoHeader />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <HindalcoFooter />
    </div>
  );
}
