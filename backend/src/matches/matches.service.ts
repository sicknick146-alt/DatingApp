import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from './match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  async findAllByStatus(status: MatchStatus): Promise<Match[]> {
    return this.matchesRepository.find({ where: { status }, order: { createdAt: 'DESC' } });
  }

  async findAll(): Promise<Match[]> {
    return this.matchesRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(userId: string, targetProfileId: string): Promise<Match> {
    const match = this.matchesRepository.create({ userId, targetProfileId, status: MatchStatus.PENDING });
    return this.matchesRepository.save(match);
  }

  async updateStatus(id: string, status: MatchStatus): Promise<Match> {
    const match = await this.matchesRepository.findOne({ where: { id } });
    if (match) {
      match.status = status;
      return this.matchesRepository.save(match);
    }
    return null;
  }
}
