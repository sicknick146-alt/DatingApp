import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messagesRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async findByMatch(matchId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { matchId },
      order: { createdAt: 'ASC' },
    });
  }

  async create(matchId: string, from: string, text: string, at: string): Promise<Message> {
    const message = this.messagesRepository.create({
      matchId,
      from,
      text,
      at,
    });
    return this.messagesRepository.save(message);
  }

  async remove(id: string): Promise<void> {
    await this.messagesRepository.delete(id);
  }
}
