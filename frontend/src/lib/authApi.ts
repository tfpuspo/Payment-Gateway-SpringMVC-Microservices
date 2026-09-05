import { gqlPublic, gqlAuth } from "./graphqlClient";
import type { AuthPayload, AuthUser } from "../types/auth.types";

const AUTH_PAYLOAD_FIELDS = `
  accessToken
  refreshToken
  user { id email name }
`;

export function register(email: string, password: string, name: string) {
  return gqlPublic<{ register: AuthPayload }>(
    `mutation Register($email: String!, $password: String!, $name: String!) {
      register(email: $email, password: $password, name: $name) { ${AUTH_PAYLOAD_FIELDS} }
    }`,
    { email, password, name }
  ).then((d) => d.register);
}

export function login(email: string, password: string) {
  return gqlPublic<{ login: AuthPayload }>(
    `mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) { ${AUTH_PAYLOAD_FIELDS} }
    }`,
    { email, password }
  ).then((d) => d.login);
}

export function refreshToken(refreshToken: string) {
  return gqlPublic<{ refreshToken: AuthPayload }>(
    `mutation Refresh($refreshToken: String!) {
      refreshToken(refreshToken: $refreshToken) { ${AUTH_PAYLOAD_FIELDS} }
    }`,
    { refreshToken }
  ).then((d) => d.refreshToken);
}

export function logout(refreshToken: string) {
  return gqlPublic<{ logout: boolean }>(
    `mutation Logout($refreshToken: String!) {
      logout(refreshToken: $refreshToken)
    }`,
    { refreshToken }
  ).then((d) => d.logout);
}

export function me(accessToken: string) {
  return gqlAuth<{ me: AuthUser | null }>(
    `query Me($token: String!) { me(token: $token) { id email name } }`,
    { token: accessToken },
    accessToken
  ).then((d) => d.me);
}
