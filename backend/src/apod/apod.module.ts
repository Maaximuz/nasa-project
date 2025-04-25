import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApodController } from './apod.controller';
import { ApodService } from './apod.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [ApodController],
  providers: [ApodService],
})
export class ApodModule {}