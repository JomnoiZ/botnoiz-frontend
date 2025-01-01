export const LarngearCampDepartment = {
    BOARD: 'BOARD',
    COOP: 'COOP',
    PLAN: 'PLAN',
    ACT: 'ACT',
    VCK: 'VCK',
    SECURITY: 'SECURITY',
    SUPPLY: 'SUPPLY',
    PLACE: 'PLACE',
    NURSE: 'NURSE',
    REG: 'REG',
    IT: 'IT',
    PR: 'PR',
    SPONSOR: 'SPONSOR',
    FINANCE: 'FINANCE',
    MC: 'MC',
};

export type TDepartment = keyof typeof LarngearCampDepartment;

export const DepartmentColors = {
    default: '#8B5CF6',
    pink: '#e65e87',
    red: '#cc3e4b',
    orange: '#f0743e',
    yellow: '#e09f34',
    green: '#46a573',
    teal: '#3e9491',
    blue: '#5c88f6',
};

export type TDepartmentColors = keyof typeof DepartmentColors;
