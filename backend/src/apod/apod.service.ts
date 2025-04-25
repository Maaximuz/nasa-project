import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { map } from 'rxjs';

@Injectable()
export class ApodService {
  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService
  ) {}

  async getApod(date?: string) {
    const apiKey = process.env.NASA_API_KEY;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}` + (date ? `&date=${date}` : '');
    return this.http.get(url).pipe(map((res) => res.data));
  }

  async getApodHistory(limit = 6) {
    return this.prisma.favorite.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}