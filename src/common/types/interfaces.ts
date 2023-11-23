import { User } from '@prisma/client'

type Environment = 'development' | 'production' | 'staging' | undefined

export const environment: Environment = process.env.MODE as Environment

export interface Cookie {
  key: string
  value: string
  httpOnly: boolean
  secure: boolean
  path: string
  maxAge: number
}

export interface TokenPayload {
  id: number
  telegramId: bigint
}

export interface SignInPayload {
  user: User
  cookie: Cookie
}
