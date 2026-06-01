import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getAllMessages() {
    return this.messagesService.findAll();
  }

  @Get(':matchId')
  async getMessages(@Param('matchId') matchId: string) {
    return this.messagesService.findByMatch(matchId);
  }

  @Post(':matchId')
  async createMessage(
    @Param('matchId') matchId: string,
    @Body('from') from: string,
    @Body('text') text: string,
    @Body('at') at: string,
  ) {
    return this.messagesService.create(matchId, from, text, at);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
