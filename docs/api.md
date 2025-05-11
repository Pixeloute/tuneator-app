# Tuneator Enterprise API Documentation

## Authentication
- JWT Bearer token in `Authorization` header
- Example: `Authorization: Bearer <token>`

## Endpoints

### Health Check
- `GET /health`
- Returns: `{ status: 'ok' }`

### Audit Logs
- `GET /api/audit/logs?userId=...`
- Auth required
- Returns: `[ { userId, action, details, timestamp } ]`

### Support Tickets
- `POST /api/support/ticket`
  - Body: `{ subject, message }`
- `GET /api/support/tickets`
- `POST /api/support/ticket/close`
  - Body: `{ id }`

### Billing
- `POST /api/billing/customer`
  - Body: `{ email }`
- `POST /api/billing/invoice`
  - Body: `{ customerId, amount }`
- `POST /api/billing/pay`
  - Body: `{ invoiceId }`

## Error Handling
- All errors return `{ error: string }` with appropriate HTTP status code 