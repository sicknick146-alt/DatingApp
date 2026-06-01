import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchStatus } from './match.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async getMatches(@Query('status') status: MatchStatus) {
    if (status) {
      return this.matchesService.findAllByStatus(status);
    }
    return this.matchesService.findAll();
  }

  @Post('like')
  async likeProfile(@Body('userId') userId: string, @Body('targetProfileId') targetProfileId: string) {
    return this.matchesService.create(userId, targetProfileId);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: MatchStatus) {
    return this.matchesService.updateStatus(id, status);
  }
}
