import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

import JwtAuthGuard from 'src/auth/jwt.guard'

export const Auth = () => applyDecorators(UseGuards(JwtAuthGuard))
