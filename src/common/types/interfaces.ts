import { User } from '@prisma/client'

type Environment = 'development' | 'production' | 'staging' | undefined

export const environment: Environment =
  (process.env.MODE as Environment) ?? 'development'

export interface Cookie {
  key: string
  value: string
  httpOnly: boolean
  secure: boolean
  maxAge: number
  path?: string
  sameSite?: string
}

export interface TokenPayload {
  id: number
  telegramId: bigint
}

export interface SignInPayload {
  user: User
  cookie: Cookie
}
