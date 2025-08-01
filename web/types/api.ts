export interface Result<T = any> {
  code: number
  message: string
  data?: T
}
