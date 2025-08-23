import type { Permit, PermitStatus } from './types';

const plantLat = 24.2045;
const plantLng = 83.0396;

function createPermit(id: string, riskLevel: 'low' | 'medium' | 'high', description: string, ppe: string, status: PermitStatus): Permit {
    const permitData = JSON.stringify({ id, risk: riskLevel });
    return {
        id,
        description,
        ppeChecklist: ppe,
        riskLevel,
        status,
        justification: `Assessment based on description and PPE requirements.`,
        lat: plantLat + (Math.random() - 0.5) * 0.02, // Spread around the plant
        lng: plantLng + (Math.random() - 0.5) * 0.02, // Spread around the plant
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(permitData)}`,
    };
}

export const initialPermits: Permit[] = [
    createPermit('PERMIT-001', 'high', 'Welding on main pipeline near storage tank 3. High fire potential.', 'Fire-retardant suit, helmet, safety goggles, gloves', 'Approved'),
    createPermit('PERMIT-002', 'medium', 'Electrical panel maintenance in Substation B. Risk of shock.', 'Insulated gloves, safety shoes, helmet, face shield', 'Approved'),
    createPermit('PERMIT-003', 'low', 'Routine inspection of conveyor belt C-12. Low risk activity.', 'Helmet, safety shoes', 'Approved'),
    createPermit('PERMIT-004', 'high', 'Working at height on Smelter roof, 50ft elevation.', 'Full body harness, helmet, non-slip boots', 'Pending'),
    createPermit('PERMIT-005', 'medium', 'Confined space entry into Tank 7 for cleaning.', 'Respirator, harness, gas detector, helmet', 'Pending'),
    createPermit('PERMIT-006', 'low', 'Cold work - replacement of water pump in cooling tower.', 'Gloves, safety shoes', 'Approved'),
    createPermit('PERMIT-007', 'high', 'Hot tapping on active steam line. Extreme heat and pressure.', 'Heat-resistant suit, face shield, insulated gloves, safety boots', 'Rejected'),
    createPermit('PERMIT-008', 'medium', 'Scaffolding erection for boiler maintenance.', 'Harness, helmet, gloves, safety boots', 'Approved'),
];
