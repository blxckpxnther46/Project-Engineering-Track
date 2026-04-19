DROP TABLE IF EXISTS billing_details;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

-- Tenants
CREATE TABLE tenants (
  tenant_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL,
  name TEXT,
  email TEXT,
  role TEXT,
  salary NUMERIC,
  ssn TEXT,
  FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);

-- Projects
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL,
  name TEXT,
  owner_id INT,
  FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
  FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

-- Billing
CREATE TABLE billing_details (
  billing_id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL,
  user_id INT,
  card_last4 TEXT,
  bank_account TEXT,
  FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- Tenants
INSERT INTO tenants (name) VALUES
('Pouch'),
('Velocity');

-- Users (FIXED column names)
INSERT INTO users (tenant_id, name, email, role, salary, ssn) VALUES
(1, 'Alice Johnson', 'alice@pouch.io', 'Admin', 125000.00, '111-22-3333'),
(1, 'Bob Smith', 'bob@pouch.io', 'Manager', 95000.00, '222-33-4444'),
(2, 'Charlie Davis', 'charlie@velocity.com', 'Admin', 140000.00, '333-44-5555'),
(2, 'David Miller', 'david@velocity.com', 'User', 75000.00, '444-55-6666');

-- Projects (make sure owner_id matches user_id)
INSERT INTO projects (tenant_id, name, owner_id) VALUES
(1, 'Pouch Portal', 1),
(2, 'Velocity Engine', 3);

-- Billing
INSERT INTO billing_details (tenant_id, user_id, card_last4, bank_account) VALUES
(1, 1, '4242', 'ACC123'),
(2, 3, '9182', 'ACC456');


CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_billing_tenant ON billing_details(tenant_id);