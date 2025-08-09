export type TaskStatus = 'Concluída' | 'Em Andamento' | 'Pendente';

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
}

export interface Task {
  id: number;
  employeeId: number;
  employeeName: string;
  task: string;
  date: string;
  hours: number;
  status: TaskStatus;
}

export interface FinancialDetail {
    municipio: string;
    paid: number;
    pending: number;
    total: number;
}

export interface Expense {
    id: number;
    employeeName: string;
    description: string;
    type: 'Viagem' | 'Vale' | 'Reembolso';
    value: number;
    date: string;
    status: 'Pago' | 'Pendente';
    invoiceUrl?: string;
}

export interface Email {
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    body: string;
    read: boolean;
}
