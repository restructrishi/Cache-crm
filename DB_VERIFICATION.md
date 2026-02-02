# Database Verification Guide

Use these SQL queries to verify the state of your database directly.

## 1. Verify Organizations
Check if organizations are created correctly.
```sql
SELECT id, name, domain, "subscriptionPlan", "isActive", "createdAt" 
FROM "Organization" 
ORDER BY "createdAt" DESC;
```

## 2. Verify Users & Super Admins
Check if users are created and linked to organizations.
```sql
SELECT id, email, "fullName", "organizationId", "accessLevel", "isActive" 
FROM "User" 
ORDER BY "createdAt" DESC;
```

## 3. Verify Roles
Check if default roles (ORG_ADMIN, USER) are created for each organization.
```sql
SELECT id, name, "organizationId", description 
FROM "Role" 
ORDER BY "createdAt" DESC;
```

## 4. Verify User Role Assignments
Check if users have the correct roles assigned.
```sql
SELECT ur."userId", u.email, ur."roleId", r.name as "roleName", r."organizationId"
FROM "UserRole" ur
JOIN "User" u ON ur."userId" = u.id
JOIN "Role" r ON ur."roleId" = r.id;
```

## 5. Verify Leads
Check if leads are created with the correct Organization and Owner scope.
```sql
SELECT l.id, l."firstName", l."lastName", l.company, l.status, l."organizationId", l."ownerId", u.email as "ownerEmail"
FROM "Lead" l
LEFT JOIN "User" u ON l."ownerId" = u.id
ORDER BY l."createdAt" DESC;
```

## Troubleshooting Common Issues

### Issue: "Missing organizationId" when creating Leads
- **Cause:** The logged-in user does not have an `organizationId` in the `User` table.
- **Fix:** Update the user to belong to an organization.
```sql
UPDATE "User" SET "organizationId" = 'YOUR_ORG_UUID' WHERE email = 'admin@company.com';
```

### Issue: Super Admin Org Creation fails
- **Cause:** Payload mismatch or missing fields.
- **Verification:** Check if the Organization exists but no Admin User was created.
```sql
SELECT * FROM "Organization" WHERE domain = 'newcompany.com';
SELECT * FROM "User" WHERE email = 'admin@newcompany.com';
```
