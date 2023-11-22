import { Cookie } from '@common/types/interfaces'

export const cookieToString = (cookie: Cookie): string =>
  `${cookie.key}=${cookie.value}; ${cookie.httpOnly ? 'HttpOnly;' : ''} ${
    cookie.secure ? 'Secure;' : ''
  } Path=${cookie.path}; Max-Age=${cookie.maxAge}`
