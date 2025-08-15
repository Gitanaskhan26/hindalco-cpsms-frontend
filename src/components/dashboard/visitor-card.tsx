import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Visitor } from '@/lib/types';

export const VisitorCard = ({ visitor }: { visitor: Visitor }) => {
  const userInitials = visitor.name.split(' ').map(n => n[0]).join('');
  const isPassActive = new Date(visitor.validUntil) > new Date();

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={visitor.avatarUrl} alt={visitor.name} data-ai-hint={visitor.avatarHint} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold">{visitor.name}</h4>
            <p className="text-gray-500 text-sm">
              {isPassActive
                ? `Pass valid for ${formatDistanceToNow(new Date(visitor.validUntil))}`
                : 'Pass expired'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild disabled={!visitor.lat || !visitor.lng}>
                <Link href={`/map?visitorId=${visitor.id}`}>
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};
