'use client';
import * as React from 'react';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut, Clock, CalendarOff, MapPin, MapPinOff, Wifi } from 'lucide-react';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VisitorPage() {
    const { user, isLoading, logout, updateUserLocation } = useUser();
    const router = useRouter();
    const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

     React.useEffect(() => {
        if (!user || user.type !== 'visitor') return;

        const trackLocation = () => {
            if (!navigator.geolocation) {
                console.warn("Geolocation is not supported by this browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (user.lat !== latitude || user.lng !== longitude) {
                        updateUserLocation(latitude, longitude);
                    }
                    setLastUpdated(new Date());
                },
                (error) => {
                    console.warn(`Could not get location: ${error.message}`);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        };

        trackLocation();
        const intervalId = setInterval(trackLocation, 30000); // Update every 30 seconds

        return () => clearInterval(intervalId);
    }, [user, updateUserLocation]);

    React.useEffect(() => {
        if (!isLoading && (!user || user.type !== 'visitor')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.type !== 'visitor') {
        return (
            <div className="container mx-auto px-4 py-6 flex flex-col items-center">
                <Skeleton className="h-12 w-48 mb-6" />
                <Skeleton className="h-[500px] w-full max-w-md" />
            </div>
        )
    }

    const { id, name, avatarUrl, avatarHint, entryTime, validUntil, lat, lng } = user;
    const userInitials = name.split(' ').map(n => n[0]).join('');
    const hasLocation = lat && lng;

    const qrCodeUrl = hasLocation 
        ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ id, name, validUntil, type: 'visitor-pass' }))}` 
        : '';

    const isExpired = new Date(validUntil) < new Date();

    return (
        <div className="container mx-auto px-4 py-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Visitor Pass</h1>
                <Button variant="outline" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </header>

            <div className="flex justify-center">
                 <Card className="w-full max-w-md">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={avatarUrl} alt={name} data-ai-hint={avatarHint} />
                            <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl">{name}</CardTitle>
                        <CardDescription>Visitor ID: {id}</CardDescription>
                         <Badge variant={isExpired ? 'destructive' : 'secondary'} className="mt-2 text-sm">
                            {isExpired ? 'Expired' : 'Active'}
                        </Badge>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        {hasLocation ? (
                            <div className="rounded-lg border-2 border-dashed p-2 bg-white">
                                <Image
                                    src={qrCodeUrl}
                                    alt={`QR Code for Visitor ${name}`}
                                    width={250}
                                    height={250}
                                    className="rounded-md"
                                    data-ai-hint="qr code"
                                    priority
                                />
                            </div>
                        ) : (
                            <Alert variant="destructive">
                                <MapPinOff className="h-4 w-4" />
                                <AlertTitle>Location Required</AlertTitle>
                                <AlertDescription>
                                    Your QR code cannot be generated without location access. Please enable location services in your browser settings and refresh the page.
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="w-full space-y-3 text-sm">
                           <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                               <div className="flex items-center gap-3 text-muted-foreground">
                                   <Clock className="h-5 w-5" />
                                   <span className="font-semibold">Entry Time</span>
                               </div>
                               <span className="font-mono text-foreground">{format(new Date(entryTime), 'dd MMM yyyy, h:mm a')}</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                               <div className="flex items-center gap-3 text-muted-foreground">
                                   <CalendarOff className="h-5 w-5" />
                                   <span className="font-semibold">Valid Until</span>
                               </div>
                               <span className="font-mono text-foreground">{format(new Date(validUntil), 'dd MMM yyyy, h:mm a')}</span>
                           </div>
                           {lat && lng && (
                               <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                   <div className="flex items-center gap-3 text-muted-foreground">
                                       <MapPin className="h-5 w-5" />
                                       <span className="font-semibold">Logged In Location</span>
                                   </div>
                                   <span className="font-mono text-foreground">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                               </div>
                           )}
                           <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                               <div className="flex items-center gap-3 text-muted-foreground">
                                   <Wifi className="h-5 w-5 text-green-500" />
                                   <span className="font-semibold">Location Status</span>
                               </div>
                               <span className="font-mono text-foreground text-xs">
                                   {lastUpdated ? `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}` : 'Updating...'}
                               </span>
                           </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center px-4">
                            This is your digital entry pass. Please present this QR code for verification.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
