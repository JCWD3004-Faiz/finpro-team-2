export enum Role {
  USER = "USER",
  STORE_ADMIN = "STORE_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface user {
  username: string;
  email: string;
  password_hash: string; 
  role?: Role;
  referral_code?: string; 
  register_code?: string; 
  refresh_token?: string; 
  image?: string; 
  updated_at?: Date;
}
