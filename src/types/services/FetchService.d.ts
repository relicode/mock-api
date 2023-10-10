type Body = Parameters<(typeof JSON)['stringify']>[0]
export default class FetchService {
  private baseUrl
  private headers
  constructor(baseUrl: string, headers: HeadersInit)
  private http
  get<T>(path: string, config?: RequestInit): Promise<T>
  post<T, B extends Body = Body>(path: string, body?: B, config?: RequestInit): Promise<T>
}
export {}
