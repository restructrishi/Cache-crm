# Purchase Order Management Module Documentation

## Overview
The Purchase Order (PO) Management Module is a comprehensive system designed to manage the entire lifecycle of purchase orders, from creation to closure. It integrates seamlessly with the existing CRM architecture and supports file attachments, role-based workflows, and audit logging.

## Key Features
1.  **Manual & Automated PO Creation**: Create POs manually or generate them from won deals.
2.  **File Attachments**: Securely upload and attach documents (PDF, DOC, XLS, Images) to PO steps.
    -   **Validation**: Max 10MB per file, strict MIME type checking.
    -   **Security**: Integrated virus scanning (mock implementation ready for ClamAV integration).
3.  **Search & Filtering**: Search by PO Number, Vendor, or Deal Name. Filter by Status.
4.  **Role-Based Workflow**: 8-stage pipeline (Sales -> Finance -> SCM -> Deployment -> Admin).
5.  **Audit Logging**: All actions (create, update, upload) are logged in `audit_logs`.

## Technical Architecture

### Backend (Node.js/NestJS/Express)
-   **Database**: PostgreSQL with Prisma ORM.
-   **Models**:
    -   `PurchaseOrder`: Main entity.
    -   `PoItem`: Line items (Product, Qty, Price).
    -   `PoStep`: Workflow stages.
    -   `PoDocument`: Attached files.
-   **Service**: `OrdersService` handles business logic and transactions.
-   **Security**:
    -   `authenticateJWT` middleware.
    -   `RoleGuard` for access control.
    -   File type validation and virus scanning in `UploadController`.

### Frontend (React/Vite)
-   **Pages**:
    -   `PurchaseOrders.tsx`: List view with DataTable.
    -   `OrderPipelineDetail.tsx`: Detail view with pipeline visualization and file uploads.
-   **Components**:
    -   `CreateOrderDrawer`: Form for creating new POs.
    -   `DataTable`: Reused for consistent UI.

## Deployment Guide

### Prerequisites
-   Node.js v18+
-   PostgreSQL 14+
-   Prisma CLI

### Installation
1.  **Database Migration**:
    ```bash
    cd backend-node
    npx prisma migrate deploy
    ```
    *Note: If `prisma migrate` is not set up for production, use `npx prisma db push` (be careful in prod).*

2.  **Build Backend**:
    ```bash
    npm run build
    ```

3.  **Build Frontend**:
    ```bash
    cd frontend
    npm run build
    ```

4.  **Start Services**:
    -   Backend: `npm start` (or use PM2).
    -   Frontend: Serve `dist` folder via Nginx or similar.

### Rollback Procedure
If the deployment fails or introduces critical bugs:

1.  **Revert Code**:
    -   Checkout the previous stable git commit/tag.
    -   `git checkout <previous-tag>`

2.  **Database Rollback**:
    -   Since the schema changes are additive (new tables), they generally won't break existing code. However, if you need to remove them:
    -   Create a rollback migration script to drop `purchase_orders`, `po_items`, `po_steps`, `po_documents` tables if strictly necessary.
    -   **Warning**: This will delete all new PO data.
    -   SQL: `DROP TABLE "po_documents", "po_steps", "po_items", "purchase_orders";`

3.  **Restart Services**:
    -   Restart backend and frontend services to reload the old code.

## API Endpoints

-   `GET /api/orders`: List all POs.
-   `GET /api/orders/:id`: Get PO details.
-   `POST /api/orders`: Create a new PO.
-   `PATCH /api/orders/:id/steps/:stepName`: Update workflow step.
-   `POST /api/orders/:id/documents`: Attach a file.
-   `POST /api/upload`: Generic file upload (returns path).

## Testing
-   Run backend tests: `npm test`
-   Run frontend tests: `npm test` (if configured)
