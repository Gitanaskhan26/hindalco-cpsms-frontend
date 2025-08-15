import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Logo = ({ width = 64, height = 64, className }: LogoProps) => {
  return (
    <img
      src={`https://placehold.co/${width}x${height}`}
      alt="Logo Placeholder"
      width={typeof width === 'string' ? undefined : Number(width)}
      height={typeof height === 'string' ? undefined : Number(height)}
      className={cn('bg-muted text-muted-foreground', className)}
      data-ai-hint="logo"
    />
  );
};
