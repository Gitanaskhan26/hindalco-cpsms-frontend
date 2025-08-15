import * as React from 'react';
import { MapPin, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Permit } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PermitCardProps {
  permit: Permit;
  isSelected: boolean;
  onSelect: (permit: Permit) => void;
  onViewQr: (permit: Permit) => void;
}

const riskVariantMap = {
    high: 'destructive',
    medium: 'secondary',
    low: 'default',
} as const;

const riskClassMap = {
    high: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
    medium: 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200',
    low: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
}

export function PermitCard({ permit, isSelected, onSelect, onViewQr }: PermitCardProps) {
  const handleSelect = () => onSelect(permit);
  const handleViewQr = () => onViewQr(permit);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      <CardHeader className="p-4" onClick={handleSelect}>
        <div className="flex items-center justify-between">
            <CardTitle className="text-base">Permit #{permit.id.slice(0, 4)}...</CardTitle>
            <Badge className={cn('capitalize', riskClassMap[permit.riskLevel])}>
                {permit.riskLevel} Risk
            </Badge>
        </div>
        <CardDescription className="line-clamp-2 pt-1">
          {permit.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        <Button variant="ghost" size="sm" onClick={handleSelect}>
          <MapPin className="mr-2 h-4 w-4" />
          View on Map
        </Button>
        <Button variant="outline" size="sm" onClick={handleViewQr}>
          <QrCode className="mr-2 h-4 w-4" />
          Validate
        </Button>
      </CardFooter>
    </Card>
  );
}
