
import { Employee, Task, FinancialDetail, Expense, Email } from './types';

export const employees: Employee[] = [
  { id: 1, name: 'Fernando Luiz', role: 'Coordenador Operacional', department: 'Técnico', email: 'fernando@infoco.com' },
  { id: 2, name: 'Wendel Infoco', role: 'Suporte Técnico', department: 'Suporte', email: 'wendel@gmail.com' },
  { id: 3, name: 'Uilber Aragão', role: 'Diretor Executivo', department: 'SEO', email: 'uilber@gmail.com' },
  { id: 4, name: 'Ana Minha Filha', role: 'Analista Financeiro', department: 'Financeiro', email: 'ana.costa@infoco.com' },
  { id: 5, name: 'Maria filha de Uilber', role: 'Advogado', department: 'Jurídico', email: 'carlos.silva@infoco.com' },
];

export const tasks: Task[] = [
  { id: 1, employeeId: 1, employeeName: 'Fernando Luiz', task: 'Análise de ARPs e Contratos', date: '08/07/2025', hours: 8, status: 'Concluída' },
  { id: 2, employeeId: 2, employeeName: 'Wendel Infoco', task: 'Suporte Sistema', date: '09/07/2025', hours: 6, status: 'Em Andamento' },
  { id: 3, employeeId: 3, employeeName: 'Uilber Aragão', task: 'Verificação de Processos Internos', date: '09/07/2025', hours: 4, status: 'Pendente' },
  { id: 4, employeeId: 4, employeeName: 'Ana Minha Filha', task: 'Relatório de Fechamento Mensal', date: '10/07/2025', hours: 7.5, status: 'Em Andamento' },
  { id: 5, employeeId: 5, employeeName: 'Maria filha de Uilber', task: 'Análise de Contrato - Cliente X', date: '15/07/2025', hours: 5, status: 'Pendente' },
];

export const financialDetails: FinancialDetail[] = [
    { municipio: 'ALMADINA', paid: 150000, pending: 25000, total: 175000 },
    { municipio: 'NOVA VIÇOSA', paid: 120000, pending: 45000, total: 165000 },
    { municipio: 'CACULÉ', paid: 95000, pending: 10000, total: 105000 },
    { municipio: 'MASCOTE', paid: 80000, pending: 30000, total: 110000 },
    { municipio: 'ITAQUARA', paid: 180000, pending: 5000, total: 185000 },
    { municipio: 'TEIXEIRA DE FREITAS', paid: 110000, pending: 12000, total: 122000 },
];

export const expenses: Expense[] = [
    { id: 1, employeeName: 'Fernando Luiz', description: 'Visita ao cliente em Nova Viçosa', type: 'Viagem', value: 350.75, date: '05/07/2025', status: 'Pago', invoiceUrl: '#' },
    { id: 2, employeeName: 'Wendel Infoco', description: 'Adiantamento quinzenal', type: 'Vale', value: 500.00, date: '15/07/2025', status: 'Pendente' },
    { id: 3, employeeName: 'Ana Minha Filha', description: 'Compra de material de escritório', type: 'Reembolso', value: 89.90, date: '02/07/2025', status: 'Pago', invoiceUrl: '#' },
    { id: 4, employeeName: 'Fernando Luiz', description: 'Adiantamento quinzenal', type: 'Vale', value: 600.00, date: '15/07/2025', status: 'Pago' },
];

export const emails: Email[] = [
    { id: '1', sender: 'Relatórios Automáticos', subject: 'Seu relatório financeiro semanal', snippet: 'Olá, segue anexo o relatório financeiro consolidado desta semana...', body: '<h1>Relatório Financeiro Semanal</h1><p>Olá, segue anexo o relatório financeiro consolidado desta semana. Por favor, revise os números e nos informe caso encontre alguma discrepância.</p><p>Atenciosamente,<br/>Sistema INFOCO</p>', read: false },
    { id: '2', sender: 'Ana Minha Filha', subject: 'Re: Dúvida sobre o balanço', snippet: 'Oi, Fernando. Revisei o balanço e tenho uma dúvida sobre o lançamento...', body: '<p>Oi, Fernando.</p><p>Revisei o balanço e tenho uma dúvida sobre o lançamento do cliente XPTO. Poderia verificar?</p><p>Obrigada,<br/>Ana</p>', read: true },
    { id: '3', sender: 'Notificações de Tarefas', subject: 'Nova tarefa atribuída: Revisão de Contrato', snippet: 'Uma nova tarefa foi atribuída a você. Detalhes: Revisão de Contrato...', body: '<h1>Nova Tarefa</h1><p>Uma nova tarefa foi atribuída a você.</p><ul><li><b>Tarefa:</b> Revisão de Contrato</li><li><b>Prazo:</b> 25/07/2025</li></ul>', read: false },
];

export type Page =
  | 'Dashboard'
  | 'Notas de Atualização'
  | 'Base de Dados'
  | 'Funcionários'
  | 'Tarefas'
  | 'Financeiro'
  | 'Recursos Humanos'
  | 'ADM Infoco'
  | 'Patrimônio'
  | 'Municípios'
  | 'Relatórios'
  | 'Usuários'
  | 'Email (Zoho)'
  | 'Configurações';

export const pages = [
  { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'Notas de Atualização', label: 'Notas de Atualização', icon: 'notes' },
  {
    id: 'Órgãos', label: 'Órgãos', icon: 'organs', subItems: [
      { id: 'Base de Dados', label: 'Base de Dados' }
    ]
  },
  { id: 'Funcionários', label: 'Funcionários', icon: 'users' },
  { id: 'Tarefas', label: 'Tarefas', icon: 'tasks' },
  { id: 'Financeiro', label: 'Financeiro', icon: 'finance' },
  { id: 'Recursos Humanos', label: 'Recursos Humanos', icon: 'hr' },
  { id: 'ADM Infoco', label: 'ADM Infoco', icon: 'adm' },
  { id: 'Patrimônio', label: 'Patrimônio', icon: 'patrimony' },
  { id: 'Municípios', label: 'Municípios', icon: 'municipalities' },
  { id: 'Relatórios', label: 'Relatórios', icon: 'reports' },
  { id: 'Usuários', label: 'Usuários', icon: 'system_users' },
  { id: 'Email (Zoho)', label: 'Email (Zoho)', icon: 'email' }
];