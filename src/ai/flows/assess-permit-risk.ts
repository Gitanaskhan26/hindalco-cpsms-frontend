import type { RiskLevel } from '@/lib/types';

export interface PermitAssessment {
  riskLevel: RiskLevel;
  justification: string;
}

export interface PermitAssessmentInput {
  description: string;
  ppeChecklist: string;
}

/**
 * Assesses the risk level of a permit based on the description and PPE checklist.
 * This is a simplified implementation that could be replaced with actual AI/ML logic.
 */
export async function assessPermitRisk(input: PermitAssessmentInput): Promise<PermitAssessment> {
  const { description, ppeChecklist } = input;
  
  // Convert to lowercase for keyword matching
  const descLower = description.toLowerCase();
  const ppeLower = ppeChecklist.toLowerCase();
  
  // Define risk indicators
  const highRiskKeywords = [
    'chemical', 'toxic', 'hazardous', 'confined space', 'height', 'electrical',
    'welding', 'cutting', 'hot work', 'crane', 'heavy machinery', 'explosive',
    'pressure', 'high temperature', 'radiation', 'asbestos'
  ];
  
  const mediumRiskKeywords = [
    'maintenance', 'repair', 'installation', 'cleaning', 'inspection',
    'machinery', 'equipment', 'tools', 'ladder', 'lifting'
  ];
  
  // Check for high-risk keywords
  const hasHighRisk = highRiskKeywords.some(keyword => 
    descLower.includes(keyword) || ppeLower.includes(keyword)
  );
  
  // Check for medium-risk keywords
  const hasMediumRisk = mediumRiskKeywords.some(keyword => 
    descLower.includes(keyword) || ppeLower.includes(keyword)
  );
  
  // Assess PPE completeness (basic check)
  const essentialPPE = ['helmet', 'safety shoes', 'gloves', 'vest', 'goggles'];
  const ppeScore = essentialPPE.filter(ppe => ppeLower.includes(ppe)).length;
  
  let riskLevel: RiskLevel;
  let justification: string;
  
  if (hasHighRisk) {
    if (ppeScore >= 4) {
      riskLevel = 'medium';
      justification = 'High-risk activity detected but comprehensive PPE reduces risk to medium level.';
    } else {
      riskLevel = 'high';
      justification = 'High-risk activity detected with insufficient PPE coverage.';
    }
  } else if (hasMediumRisk) {
    if (ppeScore >= 3) {
      riskLevel = 'low';
      justification = 'Medium-risk activity with adequate PPE reduces risk to low level.';
    } else {
      riskLevel = 'medium';
      justification = 'Medium-risk activity with basic PPE coverage.';
    }
  } else {
    if (ppeScore >= 2) {
      riskLevel = 'low';
      justification = 'Low-risk routine activity with standard PPE.';
    } else {
      riskLevel = 'medium';
      justification = 'Routine activity but insufficient PPE specified.';
    }
  }
  
  // Simulate async operation (could be replaced with actual AI API call)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    riskLevel,
    justification
  };
}
