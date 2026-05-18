// ─── Roles ───

export enum Role {
  WORKER = "worker",
  CLIENT = "client",
  ADMIN = "admin",
}

// ─── JWT ───

export interface JWTPayload {
  sub: string;
  role: Role;
  email: string;
  iat: number;
  exp: number;
}

// ─── Auth Responses ───

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  profile?: UserProfileDTO;
}

export interface UserProfileDTO {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  country?: string;
  timezone?: string;
  language: string;
  bio?: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}
