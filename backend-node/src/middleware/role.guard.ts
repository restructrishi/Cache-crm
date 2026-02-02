import { Request, Response, NextFunction } from 'express';

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure user is authenticated (handled by authenticateJWT)
    // Note: TypeScript might complain about req.user if not cast or extended
    const user = (req as any).user;

    if (!user || !user.roles) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasRole = user.roles.some((role: string) => 
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  }
}
