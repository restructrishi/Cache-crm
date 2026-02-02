import { Navigate } from 'react-router-dom';

interface RoleGuardProps {
    allowedRoles: string[];
    children: JSX.Element;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    let user = {};
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error('Error parsing user from localStorage', e);
    }

    // Only use backend roles array
    const userRoles = (user as any).roles || [];

    // Check if any user role matches any allowed role (Case Insensitive)
    const hasAccess = userRoles.some((r: string) => 
        allowedRoles.some(allowed => allowed.toLowerCase() === r.toLowerCase())
    );
    
    // If user has no access, redirect to welcome page which handles routing to correct dashboard
    if (!hasAccess) return <Navigate to="/welcome" replace />;

    return children;
}
