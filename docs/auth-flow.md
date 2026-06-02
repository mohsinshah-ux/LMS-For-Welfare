# Authentication and Authorization Flow

## JWT Flow

1. User logs in with username/email + password.
2. Backend validates credentials and account status.
3. If MFA enabled, challenge step is required.
4. On success, backend issues:
   - short-lived access token
   - longer-lived refresh token
5. Client stores tokens securely and attaches access token to API requests.
6. Expired access token is renewed via refresh endpoint.

## Authorization (RBAC)

1. JWT guard validates token signature and claims.
2. Permission guard reads required permission metadata.
3. User role-permission mappings are verified.
4. Unauthorized requests return `403`.

## Audit Integration

- Log login success/failure, logout, token refresh.
- Log all sensitive operations with actor, action, target entity, and IP/device.
