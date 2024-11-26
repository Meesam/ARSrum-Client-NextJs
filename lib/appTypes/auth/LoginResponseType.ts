export interface LoginResponseType {
  status: string;
  token: string;
  expiration: Date;
  userId: string;
  userName: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
}
