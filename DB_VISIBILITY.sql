-- 1. Verify Organizations
SELECT id, name, domain, "subscriptionPlan", "createdAt" 
FROM "Organization";

-- 2. Verify Users and their Roles (and Organization link)
SELECT 
    u.id, 
    u.email, 
    u."firstName", 
    u."lastName", 
    u."organizationId", 
    u.roles,
    o.name as "OrganizationName"
FROM "User" u
LEFT JOIN "Organization" o ON u."organizationId" = o.id;

-- 3. Verify Leads by Organization
SELECT 
    l.id, 
    l."firstName", 
    l."lastName", 
    l.company, 
    l.status, 
    l."organizationId", 
    o.name as "OrganizationName",
    l."ownerId",
    u."firstName" as "OwnerName"
FROM "Lead" l
LEFT JOIN "Organization" o ON l."organizationId" = o.id
LEFT JOIN "User" u ON l."ownerId" = u.id;

-- 4. Check for Orphaned Users (Should be only Super Admin)
SELECT * FROM "User" WHERE "organizationId" IS NULL;

-- 5. Check for Leads without Organization (Should be NONE)
SELECT * FROM "Lead" WHERE "organizationId" IS NULL;
