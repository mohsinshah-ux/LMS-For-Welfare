# RBAC Permission Matrix

## Roles

- `super_admin`
- `manager`
- `loan_officer`
- `recovery_officer`

## Permission Domains

- User and Role Management
- Employee Management
- Customer Management
- Financing Product Management
- Financing Application Lifecycle
- Agreement Management
- Installment and Payment Management
- Recovery Workflow
- Accounting and Financial Statements
- Reports and Exports
- Audit and Monitoring
- Dashboard Analytics

## Matrix

| Permission | Super Admin | Manager | Loan Officer | Recovery Officer |
|---|---|---|---|---|
| users.create/delete | Y | N | N | N |
| roles.create/delete/assign | Y | N | N | N |
| permissions.assign | Y | N | N | N |
| employees.view/manage | Y | Y (view) | N | N |
| customers.create | Y | Y | Y | N |
| customers.view | Y | Y | Y | Y |
| customers.update | Y | Y | Y | Y (notes only) |
| financing-products.manage | Y | N | N | N |
| financing-applications.create | Y | N | Y | N |
| financing-applications.submit | Y | N | Y | N |
| financing-applications.review/approve | Y | Y | N | N |
| loan-officer.assign | Y | Y | N | N |
| recovery-officer.assign | Y | Y | N | N |
| agreements.generate/upload | Y | Y | Y | N |
| installments.generate | Y | Y | Y | N |
| payments.record | Y | Y | Y | N |
| recoveries.manage | Y | Y | N | Y |
| legal-actions.track | Y | Y | N | Y |
| accounting.post-journal | Y | N | N | N |
| cashflow.view | Y | Y | N | N |
| profit-loss.view | Y | Y | N | N |
| reports.generate/export | Y | Y | Y (limited) | Y (recovery only) |
| dashboard.view-global | Y | N | N | N |
| dashboard.view-branch/team | Y | Y | Y (own) | Y (own) |
| audit-logs.view | Y | N | N | N |
| system-settings.manage | Y | N | N | N |

## Implementation Notes

- Enforce with permission-level decorators in backend.
- Frontend route guards should consume permission claims from JWT/session.
- Keep `roles` static in production and evolve permissions through migration scripts.
