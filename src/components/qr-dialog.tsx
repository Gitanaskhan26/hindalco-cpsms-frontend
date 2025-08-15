import * as React from 'react';
import Image from 'next/image';
import type { Permit } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface QRDialogProps {
  permit: Permit | null;
  onOpenChange: (isOpen: boolean) => void;
}

const riskClassMap = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-green-100 text-green-800 border-green-200',
}

export function QRDialog({ permit, onOpenChange }: QRDialogProps) {
  const isOpen = !!permit;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        {permit && (
          <>
            <DialogHeader className="text-center">
              <DialogTitle>Validate Permit</DialogTitle>
              <DialogDescription>
                Scan this QR code to validate the permit status.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="rounded-lg border-2 border-dashed p-2">
                <Image
                  src={permit.qrCodeUrl}
                  alt={`QR Code for Permit ${permit.id}`}
                  width={200}
                  height={200}
                  className="rounded-md"
                  data-ai-hint="qr code"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold">Permit #{permit.id.slice(0, 4)}...</p>
                <Badge className={cn("mt-1 capitalize", riskClassMap[permit.riskLevel])}>
                    {permit.riskLevel} Risk
                </Badge>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
