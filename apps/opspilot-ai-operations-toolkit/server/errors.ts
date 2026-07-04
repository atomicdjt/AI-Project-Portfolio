import { ZodError } from 'zod'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export interface ApiErrorBody {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function forbidden(message = 'You do not have permission to perform this action.'): ApiError {
  return new ApiError(403, 'forbidden', message)
}

export function notFound(message = 'Resource not found.'): ApiError {
  return new ApiError(404, 'not_found', message)
}

export function validationError(error: ZodError): ApiError {
  return new ApiError(400, 'validation_failed', 'Request validation failed.', error.issues)
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof ZodError) return validationError(error)
  if (error instanceof Error) return new ApiError(500, 'internal_error', error.message)
  return new ApiError(500, 'internal_error', 'Unknown server error.')
}

export function toErrorBody(error: unknown): { statusCode: number; body: ApiErrorBody } {
  const apiError = toApiError(error)
  return {
    statusCode: apiError.status,
    body: {
      error: {
        code: apiError.code,
        message: apiError.message,
        details: apiError.details,
      },
    },
  }
}
