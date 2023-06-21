/**
 * API endpoint specifications.
 *
 * @see HTTP<PathSpecs> for details on usage.
 */
export type PathSpecs = Record<string, string>

export type GetQueryParams = {
  url: URL
  headers?: Record<string, string>
}
export type QueryParams = GetQueryParams & {
  content_type?: string
  data?: Record<string, string>
}

/**
 * Helper class for abstracting URL manipulation specifically for
 * API endpoints.
 *
 */
export class HTTP<PathSpecs> {
  apiPrefix: string
  apiEndpoints: PathSpecs
  defaultHeaders: GetQueryParams["headers"]

  /**
   * Constructor for `HTTP` helper class.
   *
   * `apiEndpoints` example:
   * ```javascript
   *	{
   *		getBalance: "/zilliqa/addresses/:address",
   *		listTransactions: "/zilliqa/addresses/:address/txs",
   *	};
   * ```
   *
   * @param apiPrefix prefix to add for all endpoints URL construction.
   * @param apiEndpoints see `apiEndpoints` example above.
   */
  constructor(
    apiPrefix: string,
    apiEndpoints: PathSpecs,
    defaultHeaders?: GetQueryParams["headers"]
  ) {
    this.apiPrefix = apiPrefix
    this.apiEndpoints = apiEndpoints
    this.defaultHeaders = defaultHeaders ?? {}
  }

  /**
   * Path generator to obtain URL for a specific endpoint
   * provided in the constructor.
   *
   * example usage:
   * ```javascript
   * const http = new HTTP("http://localhost/api", { getUser: "/users/:user_id/detail" });
   * const url = http.path("getUser", { user_id: 42 }, { access_token: "awesomeAccessToken" });
   * // url: http://localhost/api/users/42/detail?access_token=awesomeAccessToken
   * ```
   *
   * @param path a key of apiEndpoints provided in the constructor.
   * @param routeParams object map for route parameters.
   * @param queryParams object map for query parameters.
   */
  path = (
    path: keyof PathSpecs,
    routeParams?: Record<string, string>,
    queryParams?: Record<string, string>
  ): URL => {
    const route: string = this.apiEndpoints[path] as string
    let url = `${this.apiPrefix}${route}`

    // substitute route params
    if (routeParams) {
      for (const paramKey in routeParams)
        url = url.replace(`:${paramKey}`, routeParams[paramKey] || "")
    }

    // append query params
    if (queryParams && Object.keys(queryParams).length) {
      const params = new URLSearchParams(queryParams)
      url += `?${params.toString()}`
    }
    return new URL(url)
  }

  /**
   * Executes HTTP GET request with fetch
   */
  get = async ({ url, headers }: GetQueryParams): Promise<Response> =>
    await fetch(url, {
      method: "GET",
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    })

  /**
   * Executes HTTP POST request with fetch
   */
  post = async ({
    url,
    data,
    content_type = "application/json",
    headers,
  }: QueryParams): Promise<Response> =>
    await fetch(url, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": content_type || "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    })

  /**
   * Executes HTTP DELETE request with fetch
   */
  del = async ({
    url,
    content_type = "application/json",
    headers,
    data,
  }: QueryParams): Promise<Response> =>
    await fetch(url, {
      method: "DELETE",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": content_type || "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    })

  /**
   * Executes HTTP multipart POST request with fetch
   */
  multi_post = async ({ url, headers, data }: QueryParams): Promise<Response> =>
    await fetch(url, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      body: JSON.stringify(data),
    })

  /**
   * Executes HTTP PUT request with fetch
   */
  put = async ({ url, headers, data }: QueryParams): Promise<Response> =>
    await fetch(url, {
      method: "PUT",
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      body: JSON.stringify(data),
    })
}
