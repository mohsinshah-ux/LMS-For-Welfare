CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE application_status AS ENUM (
  'draft',
  'submitted',
  'verification',
  'manager_review',
  'approved',
  'agreement_generation',
  'disbursed',
  'active',
  'closed',
  'rejected'
);
CREATE TYPE installment_status AS ENUM ('pending', 'paid', 'partial', 'overdue', 'written_off');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'mobile_wallet', 'cheque');
CREATE TYPE recovery_stage AS ENUM ('due', 'reminder_sent', 'follow_up', 'field_visit', 'legal_notice', 'recovery', 'closed');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'in_app');

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100),
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE designations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret TEXT,
  status user_status NOT NULL DEFAULT 'active',
  branch_id UUID REFERENCES branches(id),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(120) UNIQUE NOT NULL,
  name VARCHAR(160) NOT NULL,
  module VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE employee_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  cnic VARCHAR(25) UNIQUE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  address TEXT,
  designation_id UUID REFERENCES designations(id),
  department_id UUID REFERENCES departments(id),
  joining_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  cnic VARCHAR(25) UNIQUE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  occupation VARCHAR(120),
  monthly_income NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (monthly_income >= 0),
  family_information JSONB,
  business_name VARCHAR(200),
  business_type VARCHAR(120),
  business_address TEXT,
  annual_revenue NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (annual_revenue >= 0),
  branch_id UUID REFERENCES branches(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  document_type VARCHAR(80) NOT NULL,
  storage_path TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE financing_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE financing_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  financing_type_id UUID NOT NULL REFERENCES financing_types(id),
  product_name VARCHAR(150) NOT NULL,
  financing_limit NUMERIC(16,2) NOT NULL CHECK (financing_limit > 0),
  profit_rate NUMERIC(8,4) NOT NULL CHECK (profit_rate >= 0),
  tenure_months INT NOT NULL CHECK (tenure_months > 0),
  processing_fee NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (processing_fee >= 0),
  late_fee_rules JSONB,
  approval_workflow JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE financing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_no VARCHAR(60) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  financing_product_id UUID NOT NULL REFERENCES financing_products(id),
  financing_amount NUMERIC(16,2) NOT NULL CHECK (financing_amount > 0),
  profit_rate NUMERIC(8,4) NOT NULL CHECK (profit_rate >= 0),
  duration_months INT NOT NULL CHECK (duration_months > 0),
  purpose TEXT,
  guarantor_information JSONB,
  collateral_information JSONB,
  risk_rating VARCHAR(20),
  assigned_loan_officer_id UUID REFERENCES users(id),
  assigned_recovery_officer_id UUID REFERENCES users(id),
  status application_status NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES financing_applications(id) ON DELETE CASCADE,
  from_status application_status,
  to_status application_status NOT NULL,
  remarks TEXT,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_no VARCHAR(60) UNIQUE NOT NULL,
  application_id UUID NOT NULL REFERENCES financing_applications(id),
  agreement_type VARCHAR(80) NOT NULL,
  version_no INT NOT NULL DEFAULT 1,
  agreement_date DATE NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'draft',
  file_path TEXT,
  signature_data JSONB,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES financing_applications(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  due_date DATE NOT NULL,
  principal_amount NUMERIC(16,2) NOT NULL CHECK (principal_amount >= 0),
  profit_amount NUMERIC(16,2) NOT NULL CHECK (profit_amount >= 0),
  total_due NUMERIC(16,2) NOT NULL CHECK (total_due >= 0),
  paid_amount NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  outstanding_amount NUMERIC(16,2) NOT NULL CHECK (outstanding_amount >= 0),
  status installment_status NOT NULL DEFAULT 'pending',
  UNIQUE (application_id, installment_number)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_id UUID NOT NULL REFERENCES installments(id),
  payment_date DATE NOT NULL,
  payment_method payment_method NOT NULL,
  transaction_id VARCHAR(120),
  amount_paid NUMERIC(16,2) NOT NULL CHECK (amount_paid > 0),
  profit_portion NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (profit_portion >= 0),
  principal_portion NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (principal_portion >= 0),
  remaining_balance NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (remaining_balance >= 0),
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID UNIQUE NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  receipt_no VARCHAR(60) UNIQUE NOT NULL,
  receipt_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES financing_applications(id),
  recovery_stage recovery_stage NOT NULL DEFAULT 'due',
  note TEXT,
  follow_up_date DATE,
  legal_action_tracking TEXT,
  evidence_path TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_code VARCHAR(50) UNIQUE NOT NULL,
  account_name VARCHAR(150) NOT NULL,
  account_type VARCHAR(40) NOT NULL,
  parent_account_id UUID REFERENCES chart_of_accounts(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_no VARCHAR(60) UNIQUE NOT NULL,
  entry_date DATE NOT NULL,
  reference_type VARCHAR(60),
  reference_id UUID,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
  debit NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (credit >= 0),
  CHECK (debit = 0 OR credit = 0)
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
  journal_line_id UUID UNIQUE NOT NULL REFERENCES journal_lines(id) ON DELETE CASCADE,
  posting_date DATE NOT NULL,
  debit NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(16,2) NOT NULL DEFAULT 0 CHECK (credit >= 0)
);

CREATE TABLE cash_flow_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  entry_date DATE NOT NULL,
  flow_type VARCHAR(10) NOT NULL CHECK (flow_type IN ('inflow', 'outflow')),
  category VARCHAR(80) NOT NULL,
  amount NUMERIC(16,2) NOT NULL CHECK (amount > 0),
  reference_type VARCHAR(60),
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE profit_loss_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  entry_date DATE NOT NULL,
  entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  amount NUMERIC(16,2) NOT NULL CHECK (amount > 0),
  reference_type VARCHAR(60),
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  subject VARCHAR(200),
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE report_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(100) NOT NULL,
  requested_by UUID REFERENCES users(id),
  branch_id UUID REFERENCES branches(id),
  filters JSONB,
  export_format VARCHAR(20) NOT NULL CHECK (export_format IN ('pdf', 'excel')),
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  file_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  device_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_customers_branch ON customers(branch_id);
CREATE INDEX idx_applications_status ON financing_applications(status);
CREATE INDEX idx_applications_customer ON financing_applications(customer_id);
CREATE INDEX idx_installments_due_date_status ON installments(due_date, status);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_recoveries_stage ON recoveries(recovery_stage);
CREATE INDEX idx_audit_logs_user_time ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_cash_flow_date ON cash_flow_entries(entry_date);
CREATE INDEX idx_profit_loss_date ON profit_loss_entries(entry_date);
