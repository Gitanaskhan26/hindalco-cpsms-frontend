'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode } from 'lucide-react';

export default function ScanPage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if(videoRef.current && videoRef.current.srcObject){
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Scan Permit QR Code</h1>
        <p className="text-muted-foreground mb-6 text-center">Point your camera at a permit's QR code to validate it.</p>
        
        <div className="w-full max-w-md bg-card rounded-xl shadow-lg border p-4">
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-2/3 h-2/3 border-4 border-dashed border-white/50 rounded-lg" />
            </div>
          </div>
        
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <QrCode className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use this feature.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
