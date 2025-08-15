'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { requestVisitorPass } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Department } from '@/lib/types';

interface VisitorRequestFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onVisitorRequestSent: () => void;
}

const departments: Department[] = [
  'Administration',
  'Alumina Plant',
  'Carbon Plant',
  'Cast House',
  'Civil Maintenance',
  'Electrical Maintenance',
  'Environment',
  'Finance',
  'Fire and Safety',
  'Human Resources',
  'HVAC',
  'Instrumentation',
  'IT',
  'Laboratory',
  'Logistics',
  'Maintenance',
  'Mechanical Maintenance',
  'Power Plant',
  'Procurement',
  'Production',
  'Quality Control',
  'Rectifier',
  'Safety',
  'Security',
  'Smelter',
];

const formSchema = z.object({
  visitorName: z.string().min(2, {
    message: 'Visitor name must be at least 2 characters.',
  }),
  purpose: z.string().min(10, {
    message: 'Purpose of visit must be at least 10 characters.',
  }),
  visitingDepartment: z.enum(departments as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a department." }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function VisitorRequestForm({
  isOpen,
  onOpenChange,
  onVisitorRequestSent,
}: VisitorRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitorName: '',
      purpose: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('visitorName', values.visitorName);
    formData.append('purpose', values.purpose);
    formData.append('visitingDepartment', values.visitingDepartment);

    try {
      const result = await requestVisitorPass(formData);

      if (result.errors) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: result.message,
        });
      } else {
        toast({
          title: 'Success!',
          description: result.message,
        });
        onVisitorRequestSent();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Visitor request submission failed', error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Visitor Pass</DialogTitle>
          <DialogDescription>
            Fill in the details to request an entry pass for a visitor. This will be sent for approval.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="visitorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visitor's Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="visitingDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department to Visit</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Visit</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Attending a scheduled maintenance review with the engineering team." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Send Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
