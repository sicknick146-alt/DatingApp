import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Contact } from '../support/contact.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async getStats() {
    const totalUsers = await this.userRepo.count();
    const premiumUsers = await this.userRepo.count({ where: [{ plan: 'gold' }, { plan: 'platinum' }] });
    const activeUsers = await this.userRepo.count({ where: { status: 'active' } });
    const openTickets = await this.contactRepo.count({ where: { status: 'open' } });

    return {
      totalUsers,
      premiumUsers,
      activeUsers,
      openTickets,
    };
  }

  async getAllUsers(page = 1, limit = 20) {
    const [users, total] = await this.userRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { users, total, page, limit };
  }

  async updateUserStatus(id: number, status: string) {
    await this.userRepo.update(id, { status: status as any });
    return { message: `User ${id} status updated to ${status}` };
  }

  async getAllContacts() {
    return this.contactRepo.find({ order: { createdAt: 'DESC' } });
  }
}
