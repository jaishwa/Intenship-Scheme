const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiOptions<TBody = unknown> {
  method?: RequestMethod;
  body?: TBody;
  headers?: Record<string, string>;
  tags?: string[];
  revalidate?: number | false;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<TResponse, TBody = unknown>(
  endpoint: string,
  options: ApiOptions<TBody> = {},
): Promise<TResponse> {
  const { method = 'GET', body, headers = {}, tags, revalidate } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new ApiError(response.status, errorText);
  }

  return response.json() as Promise<TResponse>;
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T, B = unknown>(endpoint: string, body: B, options?: Omit<ApiOptions<B>, 'method'>) =>
    apiRequest<T, B>(endpoint, { ...options, method: 'POST', body }),

  put: <T, B = unknown>(endpoint: string, body: B, options?: Omit<ApiOptions<B>, 'method'>) =>
    apiRequest<T, B>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T, B = unknown>(endpoint: string, body: B, options?: Omit<ApiOptions<B>, 'method'>) =>
    apiRequest<T, B>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export { ApiError };
