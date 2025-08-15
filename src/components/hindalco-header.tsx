'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Bell,
  Menu,
  Map,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { useUser } from '@/context/user-context';

export const HindalcoHeader = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Permits', href: '/permits', icon: FileText },
    { label: 'Plant Map', href: '/map', icon: Map },
  ];

  const notifications = [
    {
      title: 'Approval Request',
      description: 'Permit #PERMIT-004 needs your review.',
      time: '5m ago',
    },
    {
      title: 'Permit Approved',
      description: 'Your request for #PERMIT-006 has been approved.',
      time: '1h ago',
    },
    {
      title: 'High-Risk Alert',
      description: 'A new high-risk permit #PERMIT-001 was created.',
      time: '3h ago',
    },
     {
      title: 'Safety Inspection Due',
      description: 'Monthly inspection for Substation B is due tomorrow.',
      time: '1 day ago',
    },
  ];

  if (!user || user.type !== 'employee') {
    // This should ideally not happen due to the AppWrapper logic, but it's a safe fallback.
    return null;
  }
  
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/80">
                  <Menu className="text-primary-foreground" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="flex items-center cursor-pointer mb-4 gap-3">
                    <Logo width={40} height={40} />
                    <span className="text-xl font-bold">C-PSMS</span>
                  </Link>
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="justify-start text-base"
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center cursor-pointer gap-3">
            <Logo width={40} height={40} />
            <span className="text-xl font-semibold hidden md:inline">C-PSMS</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
              onClick={() => router.push(item.href)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/80 relative"
              >
                <Bell className="text-primary-foreground" />
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-medium text-foreground">Notifications</h3>
                    <p className="text-sm text-muted-foreground">You have {notifications.length} new messages.</p>
                </div>
                <div className="flex flex-col max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer">
                        <Avatar className="h-8 w-8 mt-1 border border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary">
                                <ShieldCheck className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <p className="font-semibold text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground/80">{notification.time}</p>
                        </div>
                    </div>
                    ))}
                </div>
                 <div className="p-2 text-center border-t">
                    <Button variant="link" size="sm" className="text-primary font-semibold">
                    View all notifications
                    </Button>
                </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={user.name}
                    data-ai-hint={user.avatarHint}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.designation}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Department: {user.department}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Emp Code: {user.id}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
