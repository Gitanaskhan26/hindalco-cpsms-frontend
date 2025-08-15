'use server';

import { z } from 'zod';
import { assessPermitRisk } from '@/ai/flows/assess-permit-risk';
import type { Permit, Department } from './types';

const permitSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  ppeChecklist: z.string().min(5, 'PPE checklist must be at least 5 characters.'),
});

type FormState = {
  message: string;
  errors?: {
    description?: string[];
    ppeChecklist?: string[];
  };
  permit?: Permit;
};

// Default location for new permits
const plantLat = 24.2045;
const plantLng = 83.0396;

export async function createPermit(formData: FormData): Promise<FormState> {
  const validatedFields = permitSchema.safeParse({
    description: formData.get('description'),
    ppeChecklist: formData.get('ppeChecklist'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please check your input. All fields are required.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { description, ppeChecklist } = validatedFields.data;
    const assessment = await assessPermitRisk({ description, ppeChecklist });

    const id = crypto.randomUUID();
    const riskLevel = assessment.riskLevel;
    
    const permitData = JSON.stringify({ id, risk: riskLevel });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      permitData
    )}`;
    
    const newPermit: Permit = {
      id,
      description,
      ppeChecklist,
      ...assessment,
      status: 'Approved',
      lat: plantLat + (Math.random() - 0.5) * 0.02, // Add some randomness to avoid all permits at the exact same spot
      lng: plantLng + (Math.random() - 0.5) * 0.02,
      qrCodeUrl,
    };

    return { message: 'Permit created successfully.', permit: newPermit };
  } catch (error) {
    console.error('Error creating permit:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    return { message: errorMessage };
  }
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

const visitorRequestSchema = z.object({
    visitorName: z.string().min(2, 'Visitor name is required.'),
    purpose: z.string().min(10, 'Purpose must be at least 10 characters.'),
    visitingDepartment: z.enum(departments as [string, ...string[]]),
});

type VisitorRequestFormState = {
  message: string;
  errors?: {
    visitorName?: string[];
    purpose?: string[];
    visitingDepartment?: string[];
  };
};

export async function requestVisitorPass(formData: FormData): Promise<VisitorRequestFormState> {
    const validatedFields = visitorRequestSchema.safeParse({
        visitorName: formData.get('visitorName'),
        purpose: formData.get('purpose'),
        visitingDepartment: formData.get('visitingDepartment'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Please check your input. All fields are required.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // In a real application, this would trigger a workflow:
    // 1. Create a pending visitor request in the database.
    // 2. Send a notification to the head of the `visitingDepartment`.
    // For this demo, we'll just simulate a successful request.
    console.log('Visitor pass requested:', validatedFields.data);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency

    return { message: 'Visitor pass request for ' + validatedFields.data.visitorName + ' has been sent for approval.' };
}
