// Talks to the auth-service through Kong (proxied by nginx on :80 in docker-compose).
//
// Kong exposes two routes to the same underlying GraphQL API (see config/kong.yml):
//   - /graphql/public  -> no JWT required   (register, login, refreshToken, logout)
//   - /graphql         -> JWT required      (me, and future protected queries)
//
// Set VITE_API_BASE_URL in your frontend .env to override the default (nginx on localhost:80).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost";

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

async function post<T>(
  path: string,
  query: string,
  variables: Record<string, unknown>,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  if (!json.data) {
    throw new Error("No data returned from server");
  }
  return json.data;
}

/** Unauthenticated calls: register, login, refreshToken, logout. */
export function gqlPublic<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  return post<T>("/graphql/public", query, variables);
}

/** Authenticated calls: requires a valid, non-expired access token. */
export function gqlAuth<T>(
  query: string,
  variables: Record<string, unknown>,
  accessToken: string
): Promise<T> {
  return post<T>("/graphql", query, variables, accessToken);
}
