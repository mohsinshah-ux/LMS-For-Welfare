import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    if (!dto.username || !dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Placeholder user lookup for starter template.
    const payload = {
      sub: 'starter-user-id',
      username: dto.username,
      roles: ['loan_officer'],
      permissions: ['financing_applications.create', 'customers.create']
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: '15m'
    };
  }
}
