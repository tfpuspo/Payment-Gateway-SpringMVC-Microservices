// Mirrors auth-service/src/main/resources/graphql/schema.graphqls

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}
