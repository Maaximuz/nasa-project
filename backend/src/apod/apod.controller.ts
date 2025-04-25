import { Controller, Get, Query } from '@nestjs/common';
import { ApodService } from './apod.service';

@Controller('apod')
export class ApodController {
  constructor(private readonly apodService: ApodService) {}

  @Get()
  getApod(@Query('date') date?: string) {
    return this.apodService.getApod(date);
  }

  @Get('history')
  getHistory() {
    return this.apodService.getApodHistory();
  }
}
