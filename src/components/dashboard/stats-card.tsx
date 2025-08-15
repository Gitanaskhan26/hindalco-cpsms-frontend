import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const StatsCard = ({
  title,
  value,
  change
}: {
  title: string;
  value: string;
  change: string;
}) => {
  const isPositive = change.startsWith('+');

  return (
    <Card className="border-l-4 border-primary">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold">{value}</p>
          <span className={cn(
            'text-sm font-semibold',
            isPositive ? 'text-green-500' : 'text-red-500'
          )}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
