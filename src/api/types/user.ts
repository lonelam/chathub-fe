export enum UserRole {
  ADMIN = 'admin',
  NORMAL_USER = 'normal_user',
  ANONYMOUS = 'anonymous',
}

export interface UserDto {
  id: number;

  username: string;

  isActive: boolean;

  userRoles: UserRole[];
}
