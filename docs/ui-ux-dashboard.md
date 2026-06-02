# Dashboard UI/UX Blueprint

## Design Language

- Clean enterprise layout with persistent left sidebar + top command bar
- Role-contextual KPI cards
- Recharts for trends and performance visuals
- Accessible color semantics:
  - Green: healthy/performance up
  - Amber: due soon/risk
  - Red: overdue/default

## Core Widgets by Role

- **Super Admin**: total portfolio, active/closed financing, overdue installments, cash inflow/outflow, net profit, branch and employee performance, audit stream.
- **Manager**: pending approvals, financing pipeline, monthly collections, recovery status, team leaderboard.
- **Loan Officer**: assigned customers, pending verification, upcoming installments, application statuses.
- **Recovery Officer**: due/overdue accounts, recovery target vs actual, action queue.

## UX Patterns

- Guided multi-step forms for application creation
- Timeline component for customer and application history
- Side-panel quick actions for approval and recovery updates
- Export controls for PDF/Excel on report pages
