export interface AuthenticatedUser {
  id: string;
  role: 'CUSTOMER' | 'ADMIN';
  status: 'ACTIVE';
  tokenId: string;
  tokenVersion: number;
}
