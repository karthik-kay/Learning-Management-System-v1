const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API;

export async function publicRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${DJANGO_API}${endpoint}`, {
    ...options,
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: options.cache ?? "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.detail ||
        errorData?.message ||
        `Public request failed: ${res.status}`,
    );
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

export function toQueryString(params?: object) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
