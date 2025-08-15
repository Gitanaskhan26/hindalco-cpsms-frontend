export type RiskLevel = 'low' | 'medium' | 'high';
export type PermitStatus = 'Approved' | 'Pending' | 'Rejected';
export type Department =
  | 'Administration'
  | 'Alumina Plant'
  | 'Carbon Plant'
  | 'Cast House'
  | 'Civil Maintenance'
  | 'Electrical Maintenance'
  | 'Environment'
  | 'Finance'
  | 'Fire and Safety'
  | 'Human Resources'
  | 'HVAC'
  | 'Instrumentation'
  | 'IT'
  | 'Laboratory'
  | 'Logistics'
  | 'Maintenance'
  | 'Mechanical Maintenance'
  | 'Power Plant'
  | 'Procurement'
  | 'Production'
  | 'Quality Control'
  | 'Rectifier'
  | 'Safety'
  | 'Security'
  | 'Smelter';

export type Permit = {
  id: string;
  description: string;
  ppeChecklist: string;
  riskLevel: RiskLevel;
  justification: string;
  lat: number;
  lng: number;
  qrCodeUrl: string;
  status: PermitStatus;
};

export interface Employee {
  id: string; // Employee Code
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl: string;
  avatarHint: string;
  type: 'employee';
  department: Department;
  designation: string;
}

export interface Visitor {
  id: string; // Visitor ID
  dob: string; // YYYY-MM-DD
  name: string;
  avatarUrl: string;
  avatarHint: string;
  entryTime: string; // ISO 8601 string
  validUntil: string; // ISO 8601 string
  type: 'visitor';
  lat?: number;
  lng?: number;
}
