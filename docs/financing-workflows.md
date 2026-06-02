# Islamic Financing Workflows

## Supported Types

- Murabaha
- Musharakah
- Mudarabah
- Ijarah
- Salam
- Istisna

## Application Lifecycle

`draft -> submitted -> verification -> manager_review -> approved -> agreement_generation -> disbursed -> active -> closed`

## Workflow Controls

- Product-specific validation (amount, tenure, profit constraints)
- Dual-level approvals for high-value financing
- Mandatory KYC/documents before approval
- Agreement generation before disbursement
- Auto schedule generation on disbursement

## Recovery Workflow

`due -> reminder_sent -> follow_up -> field_visit -> legal_notice -> recovery -> closed`

## Compliance and Audit

- Every stage transition is stored in status history.
- Financial postings are reconciled through journal entries.
- Exceptions (write-offs, legal escalation) require manager/super-admin permission.
