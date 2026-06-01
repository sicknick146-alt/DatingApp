import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Contact } from '../support/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contact])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
