export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface RefreshTokenData {
  refresh: string;
}

export type UserRole =
  | "student"
  | "institution_admin"
  | "hod"
  | "faculty"
  | "admin"
  | "sales_exec"
  | "sales_manager"
  | "sales_admin";

export type AuthToken = {
  user: string;
  access: string;
  refresh: string;
  role: UserRole;
};

export interface UserProfile {
  id: number;
  username: string;
  email: string;

  first_name: string | null;
  last_name: string | null;

  bio: string | null;
  profile_image: string | null;
  phone_number: string | null;

  date_joined: string;
}
