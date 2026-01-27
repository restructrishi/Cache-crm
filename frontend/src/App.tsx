import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Welcome } from './pages/Welcome';
import { ComingSoon } from './components/common/ComingSoon';
import { ThemeProvider } from './context/ThemeContext';

// Dashboards
import { SuperAdminDashboard } from './pages/dashboards/SuperAdminDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { UserDashboard } from './pages/dashboards/UserDashboard';

// CRM Pages
import { Leads } from './pages/crm/Leads';
import { Deals } from './pages/crm/Deals';
import { Meetings } from './pages/crm/Meetings';
import { Quotes } from './pages/crm/Quotes';
import { getUser } from './lib/auth';

// Auth Guard
const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" />;
};

// Role Guard
const RoleRoute = ({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) => {
    const user = getUser();
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/welcome" replace />;
    }
    return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
              <Route path="/welcome" element={<Welcome />} />
              
              {/* Super Admin Routes */}
              <Route path="/super-admin" element={
                  <RoleRoute allowedRoles={['Super Admin']}>
                      <SuperAdminDashboard />
                  </RoleRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                  <RoleRoute allowedRoles={['Admin']}>
                      <MainLayout />
                  </RoleRoute>
              }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="deals" element={<Deals />} />
                  <Route path="meetings" element={<Meetings />} />
                  <Route path="quotes" element={<Quotes />} />
                  
                  {/* Admin/SuperAdmin Restricted Features */}
                  <Route path="scm" element={<ComingSoon title="SCM & Inventory" features={["Inventory Tracking", "Supplier Management", "Logistics Optimization"]} />} />
                  <Route path="deployment" element={<ComingSoon title="Deployment Manager" features={["Release Automation", "Environment Config", "Rollback Systems"]} />} />
                  <Route path="reports" element={<ComingSoon title="Advanced Reports" features={["Custom Dashboards", "Export to PDF/Excel", "Scheduled Emails"]} />} />
                  
                  {/* Common Features */}
                  <Route path="orders" element={<ComingSoon title="Purchase Orders" features={["PO Generation", "Approval Workflows", "Vendor Portal"]} />} />
                  <Route path="contacts" element={<ComingSoon title="Contacts" features={["Contact Management", "Interaction History", "Social Profile Sync"]} />} />
                  <Route path="accounts" element={<ComingSoon title="Accounts" features={["Account Hierarchy", "Territory Management", "Key Account Planning"]} />} />
                  <Route path="tickets" element={<ComingSoon title="Support Tickets" features={["Ticket Management", "SLA Tracking", "Customer Portal"]} />} />
              </Route>

              {/* User Routes (Main App Layout) */}
              <Route path="/app" element={
                  <RoleRoute allowedRoles={['User', 'Admin', 'Super Admin']}> 
                      <MainLayout />
                  </RoleRoute>
              }>
                  <Route index element={<UserDashboard />} />
                  <Route path="leads" element={<Leads />} />
                  <Route path="deals" element={<Deals />} />
                  <Route path="meetings" element={<Meetings />} />
                  <Route path="quotes" element={<Quotes />} />
                  
                  {/* Common Features */}
                  <Route path="orders" element={<ComingSoon title="Purchase Orders" features={["PO Generation", "Approval Workflows", "Vendor Portal"]} />} />
                  <Route path="contacts" element={<ComingSoon title="Contacts" features={["Contact Management", "Interaction History", "Social Profile Sync"]} />} />
                  <Route path="accounts" element={<ComingSoon title="Accounts" features={["Account Hierarchy", "Territory Management", "Key Account Planning"]} />} />
                  <Route path="tickets" element={<ComingSoon title="Support Tickets" features={["Ticket Management", "SLA Tracking", "Customer Portal"]} />} />
                  
                  {/* Role-Specific Access within App Layout */}
                  <Route path="scm" element={
                      <RoleRoute allowedRoles={['Super Admin', 'Admin']}>
                           <ComingSoon title="SCM & Inventory" features={["Inventory Tracking", "Supplier Management", "Logistics Optimization"]} />
                      </RoleRoute>
                  } />
                  <Route path="deployment" element={
                      <RoleRoute allowedRoles={['Super Admin', 'Admin']}>
                          <ComingSoon title="Deployment Manager" features={["Release Automation", "Environment Config", "Rollback Systems"]} />
                      </RoleRoute>
                  } />
                  <Route path="reports" element={
                      <RoleRoute allowedRoles={['Super Admin', 'Admin']}>
                          <ComingSoon title="Advanced Reports" features={["Custom Dashboards", "Export to PDF/Excel", "Scheduled Emails"]} />
                      </RoleRoute>
                  } />
                  <Route path="finance" element={
                      <RoleRoute allowedRoles={['Super Admin']}>
                          <ComingSoon title="Finance Hub" features={["Invoicing", "Expense Tracking", "Payroll Integration", "Tax Reports"]} />
                      </RoleRoute>
                  } />
              </Route>

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="*" element={<Navigate to="/welcome" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
