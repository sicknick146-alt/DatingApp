import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async findProfileDetails(id: number | string): Promise<any> {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(userId)) {
      throw new NotFoundException('User not found');
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');
    
    // Compute age if dob exists
    let age = undefined;
    if (user.dob) {
      const birthDate = new Date(user.dob);
      if (!isNaN(birthDate.getTime())) {
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        age = Math.abs(ageDate.getUTCFullYear() - 1970);
      }
    }

    return {
      id: user.id,
      name: user.name,
      age,
      dob: user.dob,
      gender: user.gender,
      profession: user.profession,
      height: user.height,
      city: user.city,
      bio: user.bio,
      interests: user.interests ? user.interests.split(',').map(i => i.trim()).filter(Boolean) : [],
      personality: user.personality ? user.personality.split(',').map(i => i.trim()).filter(Boolean) : [],
      hobbies: user.hobbies ? user.hobbies.split(',').map(i => i.trim()).filter(Boolean) : [],
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, data: UpdateProfileDto): Promise<Omit<User, 'password'>> {
    // Only update fields that are part of the DTO (safe update)
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    await this.userRepo.delete(id);
    return { message: `User ${user.name} deleted.` };
  }
}
