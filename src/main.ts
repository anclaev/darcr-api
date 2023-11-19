import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

import { ConfigService, LoggerService } from '@services'
import { ENV } from '@common/types/env'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const logger = app.get(LoggerService)

  const allowedOrigins = config.val<string>(ENV.ALLOWED_ORIGINS).split(',')
  const port = config.port()

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  app.enableCors({
    origin: allowedOrigins,
    allowedHeaders: '*',
    methods: '*',
    credentials: true,
  })

  await app.listen(port).finally(() => {
    logger.log(`Successfully launched on ${port} port!`)
  })
}

bootstrap()
