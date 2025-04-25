import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwt: JwtService
  ) {}
  

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.login(body.email, body.password);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: false, //trocado de true para false pois está rodando localhost, 
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15min
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return { message: 'Autenticado com sucesso' };
  }


  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.register(body.email, body.password);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return { message: 'Usuário registrado com sucesso' };
  }


  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh_token = req.cookies?.refresh_token;

    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token não encontrado.');
    }

    const payload = this.jwt.verify(refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    }) as { sub: number; email: string };

    const tokens = await this.authService.refreshTokens(payload.sub, refresh_token);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Tokens renovados' };
  }


  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user: { sub: number } },
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(req.user.sub);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logout efetuado' };
  }
}
