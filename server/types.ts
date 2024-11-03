export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type UserRole = keyof typeof UserRoles;

// Étendre l'interface Request d'Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
