const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_URL = API_BASE_URL + '/api/v1';

export interface ApiErrorResponse {
  message: string;
  code: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiError extends Error {
  response: {
    status: number;
    data: ApiErrorResponse | null;
  };

  constructor(message: string, status: number, data: ApiErrorResponse | null) {
    super(message);
    this.name = 'ApiError';
    this.response = { status, data };
  }
}

type RequestOptions = RequestInit & {
  _retry?: boolean;
};

type RefreshResponse = {
  accessToken: string;
  user: {
    id: string;
    username: string;
    emailVerifiedAt: string | null;
  };
};

class ApiClient {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private onUnauthorized: (() => void) | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  setUnauthorizedHandler(handler: (() => void) | null) {
    this.onUnauthorized = handler;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const data = await this.parseResponse<RefreshResponse | ApiErrorResponse | null>(response);

        if (!response.ok) {
          this.accessToken = null;
          return null;
        }

        const refreshData = data as RefreshResponse;
        this.accessToken = refreshData.accessToken;

        return refreshData.accessToken;
      } catch {
        this.accessToken = null;
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        ...this.getHeaders(),
        ...(options.headers ?? {}),
      },
      ...options,
    });

    const data = await this.parseResponse<ApiErrorResponse | T>(response);

    if (response.ok) {
      return data as T;
    }

    const isUnauthorized = response.status === 401;
    const isRefreshRequest = endpoint === '/auth/refresh';

    if (isUnauthorized && !options._retry && !isRefreshRequest) {
      const newAccessToken = await this.refreshAccessToken();

      if (newAccessToken) {
        return this.request<T>(endpoint, {
          ...options,
          _retry: true,
        });
      }

      this.accessToken = null;
      this.onUnauthorized?.();
    }

    throw new ApiError(
      (data as ApiErrorResponse | null)?.message || `HTTP ${response.status} ${response.statusText}`,
      response.status,
      (data as ApiErrorResponse | null) ?? null,
    );
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();