import type { Employee } from './types';

// Omit 'type' as it will be added by the fetch function
export const mockEmployees: Omit<Employee, 'type'>[] = [
  {
    id: '12345',
    dob: '1990-01-15',
    name: 'Ramesh Kumar',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
    department: 'Mechanical Maintenance',
    designation: 'Lead Engineer',
  },
  {
    id: '67890',
    dob: '1985-05-20',
    name: 'Sunita Sharma',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait',
    department: 'Fire and Safety',
    designation: 'Safety Officer',
  },
  {
    id: '11223',
    dob: '1982-08-01',
    name: 'Anil Mehta',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait security',
    department: 'Security',
    designation: 'Head of Security',
  },
    {
    id: '44556',
    dob: '1992-03-30',
    name: 'Pooja Desai',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait professional',
    department: 'Cast House',
    designation: 'Shift Supervisor',
  },
  {
    id: '23456',
    dob: '1988-04-12',
    name: 'Rajesh Singh',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
    department: 'Electrical Maintenance',
    designation: 'Senior Technician',
  },
  {
    id: '34567',
    dob: '1995-11-23',
    name: 'Meena Iyer',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait',
    department: 'Alumina Plant',
    designation: 'Operator',
  },
  {
    id: '45678',
    dob: '1979-02-18',
    name: 'Vikram Rathod',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait serious',
    department: 'Safety',
    designation: 'Safety Inspector',
  },
  {
    id: '56789',
    dob: '1993-07-05',
    name: 'Geeta Joshi',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait professional',
    department: 'Security',
    designation: 'Security Guard',
  },
  {
    id: '67891',
    dob: '1980-09-14',
    name: 'Suresh Patel',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait professional',
    department: 'HVAC',
    designation: 'Mechanical Engineer',
  },
  {
    id: '78901',
    dob: '1991-01-28',
    name: 'Kavita Nair',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait glasses',
    department: 'Quality Control',
    designation: 'Lab Technician',
  },
  {
    id: '89012',
    dob: '1987-06-19',
    name: 'Deepak Chopra',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait bearded',
    department: 'Environment',
    designation: 'EHS Coordinator',
  },
  {
    id: '90123',
    dob: '1996-12-30',
    name: 'Priya Reddy',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait smiling',
    department: 'Rectifier',
    designation: 'Electrical Technician',
  },
  {
    id: '12346',
    dob: '1984-10-02',
    name: 'Harish Tiwari',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait formal',
    department: 'Carbon Plant',
    designation: 'Shift In-charge',
  },
  {
    id: '23457',
    dob: '1990-08-15',
    name: 'Fatima Khan',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait smiling professional',
    department: 'Security',
    designation: 'CCTV Operator',
  },
  {
    id: '34568',
    dob: '1986-03-25',
    name: 'Manoj Verma',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait worker',
    department: 'Civil Maintenance',
    designation: 'Welder',
  },
  {
    id: '45679',
    dob: '1994-05-11',
    name: 'Sneha Gupta',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait professional',
    department: 'IT',
    designation: 'Junior Engineer',
  },
  {
    id: '56790',
    dob: '1975-11-08',
    name: 'Alok Nath',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait older',
    department: 'Finance',
    designation: 'Senior Accountant',
  },
  {
    id: '67892',
    dob: '1989-07-22',
    name: 'Sandeep Yadav',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait security guard',
    department: 'Security',
    designation: 'Patrol Officer',
  },
  {
    id: '78902',
    dob: '1998-02-09',
    name: 'Ishan Kishan',
    avatarUrl: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait young',
    department: 'Logistics',
    designation: 'Supply Chain Coordinator',
  },
];

// Mock function to simulate fetching from a database
export const fetchEmployeeDetails = async (employeeCode: string, dob: string): Promise<Employee | null> => {
  // In a real app, this would be an API call to Oracle APEX
  const employee = mockEmployees.find(emp => emp.id === employeeCode && emp.dob === dob);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (employee) {
    return { ...employee, type: 'employee' };
  }
  
  return null;
};
