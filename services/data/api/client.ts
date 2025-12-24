import { API_BASE_URL, API_TIMEOUT } from "@/services/env";

/**
 * API client configuration
 */
export interface RequestConfig {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: unknown;
	timeout?: number;
}

/**
 * Generic API error
 */
export class APIError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public responseBody?: unknown
	) {
		super(message);
		this.name = "APIError";
	}
}

/**
 * HTTP client for API requests
 */
class APIClient {
	private baseURL: string;
	private defaultTimeout: number;
	private authToken: string | null = null;

	constructor(baseURL: string, timeout: number = 30000) {
		this.baseURL = baseURL;
		this.defaultTimeout = timeout;
	}

	/**
	 * Set authentication token for subsequent requests
	 */
	setAuthToken(token: string | null) {
		this.authToken = token;
	}

	/**
	 * Make an HTTP request
	 */
	async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
		const {
			method = "GET",
			headers = {},
			body,
			timeout = this.defaultTimeout,
		} = config;

		const url = `${this.baseURL}${endpoint}`;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const requestHeaders: Record<string, string> = {
				"Content-Type": "application/json",
				...headers,
			};

			// Add auth token if available
			if (this.authToken) {
				requestHeaders["Authorization"] = `Bearer ${this.authToken}`;
			}

			const response = await fetch(url, {
				method,
				headers: requestHeaders,
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			// Parse response
			let responseData: unknown;
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				responseData = await response.json();
			} else {
				responseData = await response.text();
			}

			// Handle error responses
			if (!response.ok) {
				throw new APIError(
					`HTTP ${response.status}: ${response.statusText}`,
					response.status,
					responseData
				);
			}

			return responseData as T;
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof APIError) {
				throw error;
			}

			if (error instanceof Error) {
				if (error.name === "AbortError") {
					throw new APIError("Request timeout");
				}
				throw new APIError(error.message);
			}

			throw new APIError("Unknown error occurred");
		}
	}

	/**
	 * GET request
	 */
	async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "GET" });
	}

	/**
	 * POST request
	 */
	async post<T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "POST", body });
	}

	/**
	 * PUT request
	 */
	async put<T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "PUT", body });
	}

	/**
	 * PATCH request
	 */
	async patch<T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "PATCH", body });
	}

	/**
	 * DELETE request
	 */
	async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "DELETE" });
	}
}

// Export singleton instance
export const apiClient = new APIClient(API_BASE_URL, API_TIMEOUT);
