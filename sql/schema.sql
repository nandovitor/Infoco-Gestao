import { pgTable, text, varchar, timestamp, uuid, integer, real, boolean, jsonb, primaryKey, pgEnum } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'coordinator', 'support', 'director']);
export const taskStatus = pgEnum('task_status', ['Concluída', 'Em Andamento', 'Pendente']);
export const expenseType = pgEnum('expense_type', ['Salário', 'Vale', 'Viagem', 'Reembolso', 'Outro']);
export const paymentStatus = pgEnum('payment_status', ['Pago', 'Pendente']);
export const internalExpenseCategory = pgEnum('internal_expense_category', ['Material de Escritório', 'Contas Fixas', 'Manutenção', 'Marketing', 'Outros']);
export const assetStatus = pgEnum('asset_status', ['Em Uso', 'Em Manutenção', 'Danificado', 'Descartado']);
export const notificationType = pgEnum('notification_type', ['system', 'reminder']);
export const transactionType = pgEnum('transaction_type', ['receivable', 'payable']);
export const transactionStatus = pgEnum('transaction_status', ['pending', 'paid']);
export const leaveType = pgEnum('leave_type', ['Férias', 'Licença Médica', 'Outro']);
export const leaveStatus = pgEnum('leave_status', ['Pendente', 'Aprovada', 'Rejeitada']);
export const externalSystemType = pgEnum('external_system_type', ['Contábil', 'Licitações', 'Almoxarifado', 'Patrimônio', 'Outro']);


export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRole('role').notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  pfp: text('pfp'),
  passwordHash: text('password_hash').notNull(),
});

export const employees = pgTable('employees', {
    id: integer('id').primaryKey(), // Using integer to match old structure, could be serial()
    name: varchar('name', { length: 255 }).notNull(),
    position: varchar('position', { length: 255 }).notNull(),
    department: varchar('department', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    baseSalary: real('base_salary'),
});

export const tasks = pgTable('tasks', {
    id: integer('id').primaryKey(),
    employeeId: integer('employee_id').notNull().references(() => employees.id),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    date: timestamp('date', { mode: 'string' }).notNull(),
    hours: real('hours').notNull(),
    status: taskStatus('status').notNull(),
});

export const financeData = pgTable('finance_data', {
    id: integer('id').primaryKey(),
    municipality: varchar('municipality', { length: 255 }).notNull().unique(),
    paid: real('paid').notNull().default(0),
    pending: real('pending').notNull().default(0),
    contractEndDate: timestamp('contract_end_date', { mode: 'string' }).notNull(),
    coatOfArmsUrl: text('coat_of_arms_url'),
});

export const updatePosts = pgTable('update_posts', {
    id: integer('id').primaryKey(),
    authorId: uuid('author_id').notNull().references(() => profiles.id),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const employeeExpenses = pgTable('employee_expenses', {
    id: integer('id').primaryKey(),
    employeeId: integer('employee_id').notNull().references(() => employees.id),
    type: expenseType('type').notNull(),
    description: text('description').notNull(),
    amount: real('amount').notNull(),
    date: timestamp('date', { mode: 'string' }).notNull(),
    status: paymentStatus('status').notNull(),
    receipt: text('receipt'),
});

export const suppliers = pgTable('suppliers', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    contactPerson: varchar('contact_person', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
});

export const internalExpenses = pgTable('internal_expenses', {
    id: integer('id').primaryKey(),
    description: text('description').notNull(),
    category: internalExpenseCategory('category').notNull(),
    amount: real('amount').notNull(),
    date: timestamp('date', { mode: 'string' }).notNull(),
    supplierId: integer('supplier_id').references(() => suppliers.id),
});

export const assets = pgTable('assets', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    purchaseDate: timestamp('purchase_date', { mode: 'string' }).notNull(),
    purchaseValue: real('purchase_value').notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    status: assetStatus('status').notNull(),
    assignedToEmployeeId: integer('assigned_to_employee_id').references(() => employees.id),
    maintenanceLog: jsonb('maintenance_log').default('[]'),
});

export const managedFiles = pgTable('managed_files', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    type: varchar('type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    url: text('url').notNull(),
    municipalityName: varchar('municipality_name', { length: 255 }).notNull(),
    folder: varchar('folder', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const paymentNotes = pgTable('payment_notes', {
    id: integer('id').primaryKey(),
    referenceMonth: varchar('reference_month', { length: 7 }).notNull(), // YYYY-MM
    description: text('description').notNull(),
    uploadDate: timestamp('upload_date', { mode: 'string' }).notNull().defaultNow(),
    municipalityName: varchar('municipality_name', { length: 255 }).notNull(),
    fileUrl: text('file_url').notNull(),
    fileName: text('file_name').notNull(),
    fileSize: integer('file_size').notNull(),
    fileType: varchar('file_type', { length: 100 }).notNull(),
});

export const notifications = pgTable('notifications', {
    id: integer('id').primaryKey(),
    type: notificationType('type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    date: timestamp('date', { mode: 'string' }).notNull().defaultNow(),
    eventDate: timestamp('event_date', { mode: 'string' }),
    read: boolean('read').notNull().default(false),
    link: text('link'),
});

export const transactions = pgTable('transactions', {
    id: integer('id').primaryKey(),
    type: transactionType('type').notNull(),
    description: text('description').notNull(),
    amount: real('amount').notNull(),
    dueDate: timestamp('due_date', { mode: 'string' }).notNull(),
    paymentDate: timestamp('payment_date', { mode: 'string' }),
    status: transactionStatus('status').notNull(),
    municipalityId: integer('municipality_id').references(() => financeData.id),
});

export const payrolls = pgTable('payrolls', {
    id: integer('id').primaryKey(),
    employeeId: integer('employee_id').notNull().references(() => employees.id),
    monthYear: varchar('month_year', { length: 7 }).notNull(), // YYYY-MM
    baseSalary: real('base_salary').notNull(),
    benefits: real('benefits').notNull(),
    deductions: real('deductions').notNull(),
    netPay: real('net_pay').notNull(),
    payDate: timestamp('pay_date', { mode: 'string' }).notNull(),
});

export const leaveRequests = pgTable('leave_requests', {
    id: integer('id').primaryKey(),
    employeeId: integer('employee_id').notNull().references(() => employees.id),
    type: leaveType('type').notNull(),
    startDate: timestamp('start_date', { mode: 'string' }).notNull(),
    endDate: timestamp('end_date', { mode: 'string' }).notNull(),
    reason: text('reason').notNull(),
    status: leaveStatus('status').notNull(),
});

export const externalSystems = pgTable('external_systems', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    type: externalSystemType('type').notNull(),
    apiUrl: text('api_url').notNull(),
    accessToken: text('access_token').notNull(),
    tokenType: varchar('token_type', { length: 50 }).notNull(),
});

// A simple key-value table for general config
export const config = pgTable('config', {
  key: varchar('key', {length: 255}).primaryKey(),
  value: jsonb('value'),
});