export interface User {
  id: number;
  email?: string;
  username?: string;
  password: string;
  [key: string]: unknown;
}
