export const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : '')

export const responseIsSuccessful = (response: Response) => response.status >= 200 && response.status <= 299

export const delay = (ms = 250): Promise<void> => new Promise((r) => setTimeout(r, ms))
