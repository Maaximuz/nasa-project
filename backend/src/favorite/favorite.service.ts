import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


const prisma = new PrismaClient();

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}
  async create(
    body: { title: string; imageUrl: string; description?: string },
    userId: number
  ) {
    return this.prisma.favorite.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        description: body.description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: number, order: 'asc' | 'desc') {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: order },
    });
  }

  async findById(id: number, userId: number) {
    return this.prisma.favorite.findFirst({
      where: {
        id,
        userId
      }
    });
  }
}