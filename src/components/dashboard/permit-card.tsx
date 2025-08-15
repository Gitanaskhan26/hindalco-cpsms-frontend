import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

type Risk = 'High' | 'Medium' | 'Low';
type Status = 'Approved' | 'Pending' | 'Rejected';

const riskColorMap: Record<Risk, string> = {
  High: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  Medium: 'bg-orange-400/10 text-orange-500 border-orange-400/20 hover:bg-orange-400/20',
  Low: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
};

const statusColorMap: Record<Status, string> = {
  Approved: 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20',
  Pending: 'bg-orange-400/10 text-orange-500 border-orange-400/20 hover:bg-orange-400/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
};

const RiskBadge = ({ risk }: { risk: Risk }) => {
  return <Badge variant="outline" className={cn('capitalize font-semibold', riskColorMap[risk])}>{risk}</Badge>;
};

const StatusBadge = ({ status }: { status: Status }) => {
  return <Badge variant="outline" className={cn('capitalize font-semibold', statusColorMap[status])}>{status}</Badge>;
};

export const PermitCard = ({
  id,
  type,
  location,
  risk,
  status,
}: {
  id: string;
  type: string;
  location: string;
  risk: Risk;
  status: Status;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold">{id} - {type}</h4>
            <p className="text-gray-500 text-sm">{location}</p>
          </div>
          <div className="flex items-center space-x-2">
            <RiskBadge risk={risk} />
            <StatusBadge status={status} />
          </div>
        </div>
        
        <div className="flex justify-end items-center mt-3">
            <Button variant="ghost" size="sm" asChild>
                <Link href={`/map?permitId=${id}`}>
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};
