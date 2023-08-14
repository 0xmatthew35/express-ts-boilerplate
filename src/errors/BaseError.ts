export type BaseError = {
  code: number
  error_code?: string
} & Error
