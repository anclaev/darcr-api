import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Darcr API')
    .setDescription('')
    .setVersion('0.0.1')
    .build()

  const doc = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, doc)

  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '').split(',')

  app.enableCors({
    origin: allowedOrigins,
    allowedHeaders: '*',
    methods: '*',
  })

  await app.listen(3000)
}
bootstrap()
