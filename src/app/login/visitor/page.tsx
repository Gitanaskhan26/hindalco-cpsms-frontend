'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCheck, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function VisitorLoginPage() {
  const router = useRouter();
  const { loginVisitor } = useUser();
  const { toast } = useToast();
  const [visitorId, setVisitorId] = React.useState('V-98765');
  const [dob, setDob] = React.useState<Date | undefined>(new Date('1988-11-22'));
  const [isLoading, setIsLoading] = React.useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorId || !dob) {
      toast({
          variant: 'destructive',
          title: 'Missing Information',
          description: 'Please enter your Visitor ID and Date of Birth.',
      });
      return;
    }
    setIsLoading(true);

    const dobString = format(dob, 'yyyy-MM-dd');
    const success = await loginVisitor(visitorId, dobString);

    setIsLoading(false);

    if (success) {
      router.push('/visitor');
    } else {
      toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid Visitor ID or Date of Birth. Please try again.',
      });
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden bg-gray-100 lg:flex flex-col items-center justify-center p-12 text-white bg-primary">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url(https://placehold.co/1200x1200/cccccc/cccccc.png)'}}
          data-ai-hint="corporate building welcome"
        />
        <div className="relative z-10 text-center">
            <Logo width={64} height={64} className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold">
              Welcome, Visitor!
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
                Your safety and security are our top priorities. Please log in to access your visitor pass.
            </p>
             <div className="mt-8 space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-start gap-4">
                    <UserCheck className="h-8 w-8 mt-1 text-accent flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Digital Visitor Pass</h3>
                        <p className="text-sm text-primary-foreground/70">Access your secure, digital entry pass with a unique QR code.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <UserCheck className="h-8 w-8 mt-1 text-accent flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Instant Verification</h3>
                        <p className="text-sm text-primary-foreground/70">Enjoy a smooth entry process with quick QR code verification at security checkpoints.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <Card className="w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm">
          <CardHeader className="text-center">
             <div className="mb-4 flex justify-center lg:hidden">
                <Logo width={64} height={64} />
            </div>
            <CardTitle className="text-2xl">Visitor Login</CardTitle>
            <CardDescription>
              Enter your Visitor ID and Date of Birth to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visitor-id">Visitor ID</Label>
                <Input
                  id="visitor-id"
                  type="text"
                  placeholder="e.g., V-12345"
                  value={visitorId}
                  onChange={(e) => setVisitorId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dob && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-buttons"
                      fromYear={1930}
                      toYear={new Date().getFullYear()}
                      selected={dob}
                      onSelect={setDob}
                      initialFocus
                       disabled={(date) =>
                        date > new Date() || date < new Date("1930-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col items-center justify-center gap-2">
            <Button variant="link" asChild className="p-0 h-auto font-normal text-sm">
                <Link href="/login">
                    Are you an employee? Login here.
                </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              © Hindalco Industries Ltd. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
