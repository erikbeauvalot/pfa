export const UserRoles = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER'
  } as const;
  
  export type UserRole = typeof UserRoles[keyof typeof UserRoles];