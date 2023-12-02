export interface DecodedToken {
    email: string;
    role: 'user' | 'admin' | 'inactive';
  }