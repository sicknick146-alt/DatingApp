import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { SupportModule } from './support/support.module';
import { HealthController } from './health.controller';
import { MessagesModule } from './messages/messages.module';
import { MatchesModule } from './matches/matches.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dating_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables in dev (disable in production)
      logging: false,
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    SupportModule,
    MessagesModule,
    MatchesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
