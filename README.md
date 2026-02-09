# Cache CRM

Cache CRM is a comprehensive Customer Relationship Management (CRM) solution designed to manage the entire lifecycle of business operations, from lead generation to deployment and support. It features a modern, responsive frontend and a robust, scalable backend.

## 🚀 Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **State Management**: React Context / Local State

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) with Passport strategy
- **File Handling**: Multer (Local storage with validation)

## 🏗 Architecture & Modules

The application is structured around key business modules:

### 1. CRM Core
- **Leads**: Manage potential business opportunities.
- **Accounts**: Corporate/Business entities.
- **Contacts**: Individuals associated with accounts.
- **Deals**: Sales opportunities tracking.
- **Meetings**: Scheduling and tracking interactions.

### 2. Sales & Pre-Sales
- **Quotes**: Generate and manage price quotes.
- **PreSales**: Solution Designs, BOQ (Bill of Quantities), and SOW (Scope of Work) documents.

### 3. Order Management (PO)
- **Customer POs**: Track incoming purchase orders from clients.
- **Purchase Orders (Vendor)**: Manage outgoing orders to vendors.
- **Pipeline**: Visual "Jenkins-style" order processing pipeline with stage-based workflows.

### 4. Supply Chain & Operations
- **SCM & Inventory**: Inventory management, GRN (Goods Received Note) receipts.
- **Deployments**: Track engineering deployments, scheduling, and sign-offs.

### 5. Administration
- **User Management**: Role-based access control (RBAC).
- **Roles**: 
  - `SUPER_ADMIN`: Full system access.
  - `ORG_ADMIN`: Organization-level management.
  - `USER`: Standard access restricted by role permissions.
- **Analytics**: Dashboard for KPIs and business metrics.

## 📂 Project Structure

```
Cache-crm/
├── backend-node/           # NestJS Backend API
│   ├── prisma/             # Database Schema & Migrations
│   ├── src/
│   │   ├── modules/        # Feature-based modules (auth, leads, orders, etc.)
│   │   ├── middleware/     # Auth & Error handling
│   │   └── main.ts         # App entry point
│   └── test/               # E2E Tests
│
├── frontend/               # React Frontend Application
│   ├── src/
│   │   ├── api/            # API integration layer
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views/routes
│   │   └── lib/            # Utilities
│   └── public/             # Static assets
```

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** (Node Package Manager)

## ⚙️ Installation & Setup

### 1. Database Setup
Ensure PostgreSQL is running and create a database (e.g., `cache_crm_db`).

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend-node
```

Install dependencies:
```bash
npm install
```

Configure Environment Variables:
Create a `.env` file in `backend-node/` with the following:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cache_crm_db?schema=public"
JWT_SECRET="your-super-secret-key"
PORT=3000
```

Run Database Migrations:
```bash
npx prisma migrate dev
```

Seed Initial Data (Super Admin):
```bash
npx ts-node prisma/seed-superadmin.ts
```
*Creates user: `superadmin@cachecrm.com` / `securepassword123`*

Start the Server:
```bash
npm start
```
*The API will run on `http://localhost:3000`*

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Development Server:
```bash
npm run dev
```
*The application will be accessible at `http://localhost:5173`*

## 🧪 Running Tests

**Backend Unit & E2E Tests**:
```bash
cd backend-node
npm run test
npm run test:e2e
```

**Regression Testing**:
```bash
cd backend-node
npx ts-node scripts/regression-test.ts
```

## 🔐 Authentication Flow

1. **Login**: User submits credentials to `/api/auth/login`.
2. **Token**: Server validates and returns a JWT.
3. **Storage**: Frontend stores the token (e.g., localStorage).
4. **Requests**: All protected API requests include the token in the `Authorization` header (`Bearer <token>`).

## 📦 Deployment

### Backend
1. Build the application: `npm run build`
2. Start production server: `npm run start:prod`
3. Ensure `DATABASE_URL` is set in the production environment.

### Frontend
1. Build for production: `npm run build`
2. Serve the `dist/` folder using a static file server (e.g., Nginx, Vercel, Netlify).

## 📄 License
[UNLICENSED] - Private Proprietary Software.
