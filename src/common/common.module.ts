import {
  ConfigModule,
  ConfigService as RootConfigService,
} from '@nestjs/config'

import { Global, Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'
import { CqrsModule } from '@nestjs/cqrs'

import { LoggerService, SessionService, ConfigService } from './services'
import { UserRepository } from 'src/user/user.repository'

import { ENV } from './types/env'

@Global()
@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (config: RootConfigService) => {
        return {
          prismaOptions: {
            datasources: {
              db: {
                url: config.get<string>(ENV.DATABASE_URL),
              },
            },
          },
          explicitConnect: false,
        }
      },
      inject: [RootConfigService],
    }),
  ],
  providers: [ConfigService, LoggerService, SessionService, UserRepository],
  exports: [ConfigService, LoggerService, SessionService],
})
export class CommonModule {}
