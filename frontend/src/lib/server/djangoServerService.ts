import { cookies } from "next/headers";

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API;

export async function djangoServerRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  };

  const res = await fetch(`${DJANGO_API}${endpoint}`, {
    ...options,
    headers: finalHeaders,
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}
