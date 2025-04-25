import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Req } from '@nestjs/common';

@Controller('favorite')
@UseGuards(JwtAuthGuard) // Protege todas as rotas do controller
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() body: { title: string; imageUrl: string; description?: string },
    @Req() req: Request & { user: { sub: number } }
  ) {
    return this.favoriteService.create(body, req.user.sub);
  }

  @Get()
  findAll(@Query('order') order: 'asc' | 'desc' = 'desc', @Request() req)
  {
    const safeOrder = order === 'asc' ? 'asc' : 'desc';
    return this.favoriteService.findAll(req.user.userId, safeOrder);
  }

  @Get(':id')
  findOne(@Param('id') id, @Request() req) {
    return this.favoriteService.findById(Number(id), req.user.userId);
  }
}
