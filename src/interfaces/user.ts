import { TDepartment, TDepartmentColors } from './department';

export interface IUser {
    _id: string;
    studentId: string;
    displayName: string;
    userId: string;
    enableBot: boolean;
    selectedDepartments: TDepartment[];
    superuser: boolean;
    selectedColors: Record<TDepartment, TDepartmentColors>;
}
