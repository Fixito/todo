export interface User {
  id: string;
  email: string;
  password: string;
}
export type UserWithoutPassword = Omit<User, 'password'>;
//# sourceMappingURL=user.d.ts.map
