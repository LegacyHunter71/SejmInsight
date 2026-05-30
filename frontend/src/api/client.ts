import { authFetch } from "../auth/authFetch";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError {
    status: number;
    message: string;
    details?: any;
}

const getBaseUrl = () => {
    // Vite env variable
    const v = import.meta.env.VITE_API_BASE_URL as string | undefined;
    if (v) return v.replace(/\/$/, "");
    if (typeof window !== "undefined" && window.location) {
        return `${window.location.origin}/api`;
    }
    // fallback for SSR or unknown env
    return "http://localhost/api";
};

async function parseResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) {
        // No content
        return undefined as unknown as T;
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        const body = await res.json();
        return body as T;
    }

    // fallback to text
    const text = await res.text();
    return text as unknown as T;
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.ok) {
        return parseResponse<T>(res);
    }

    let parsed: any = undefined;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        try {
            parsed = await res.json();
        } catch (e) {
            parsed = undefined;
        }
    } else {
        try {
            parsed = await res.text();
        } catch (e) {
            parsed = undefined;
        }
    }

    const err: ApiError = {
        status: res.status,
        message: parsed?.message ?? res.statusText ?? "Unknown error",
        details: parsed,
    };

    throw err;
}

function buildUrl(path: string, query?: Record<string, any>) {
    const base = getBaseUrl().replace(/\/$/, "");
    const cleanPath = `/${path.replace(/^\//, "")}`;
    const urlStr = `${base}${cleanPath}`;
    const url = new URL(urlStr);
    if (query) {
        Object.entries(query).forEach(([k, v]) => {
            if (v === undefined || v === null) return;
            if (Array.isArray(v)) {
                v.forEach((item) => url.searchParams.append(k, String(item)));
                return;
            }
            url.searchParams.set(k, String(v));
        });
    }
    return url.toString();
}

export async function apiRequest<T = any>(
    method: HttpMethod,
    path: string,
    options: {
        query?: Record<string, any>;
        body?: any;
        headers?: Record<string, string>;
        signal?: AbortSignal;
    } = {},
): Promise<T> {
    const url = buildUrl(path, options.query);

    const headers: Record<string, string> = {
        Accept: "application/json",
        ...(options.headers ?? {}),
    };

    let body: BodyInit | undefined;
    if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(options.body);
    }

    const res = await authFetch(url, {
        method,
        headers,
        body,
        signal: options.signal,
    });

    return handleResponse<T>(res);
}

export const api = {
    get: <T = any>(path: string, opts?: { query?: Record<string, any>; signal?: AbortSignal }) =>
        apiRequest<T>("GET", path, { query: opts?.query, signal: opts?.signal }),
    post: <T = any>(path: string, body?: any) => apiRequest<T>("POST", path, { body }),
    put: <T = any>(path: string, body?: any) => apiRequest<T>("PUT", path, { body }),
    patch: <T = any>(path: string, body?: any) => apiRequest<T>("PATCH", path, { body }),
    del: <T = any>(path: string) => apiRequest<T>("DELETE", path),
};

export default api;
