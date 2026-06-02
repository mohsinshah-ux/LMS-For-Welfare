import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.username }]
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordOk = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordOk) throw new UnauthorizedException('Invalid credentials');

    const roles = user.roles.map((r) => r.role.code);
    const permissions = user.roles.flatMap((r) =>
      r.role.permissions.map((rp) => rp.permission.code)
    );

    const payload = {
      sub: user.id,
      username: user.username,
      roles,
      permissions
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      tokenType: 'Bearer',
      expiresIn: '15m',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles,
        permissions
      }
    };
  }
}
