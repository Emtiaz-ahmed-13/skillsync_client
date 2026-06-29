/** Browser-side API base — uses Next.js rewrite proxy to backend */
export const API_BASE = "/api/v1";

export const apiPath = (path: string) =>
  path.startsWith("/api/v1") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
