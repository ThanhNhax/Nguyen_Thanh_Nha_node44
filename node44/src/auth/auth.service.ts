import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private configServise: ConfigService,
  ) {}

  async login({ email, pass: pass_word }: LoginAuthDto) {
    try {
      // Check email có trong Db chưa
      const user = await this.validateUser(email, pass_word);

      // Tạo payload cho token
      const payload = {
        sub: user.user_id,
      };
      // Tạo token
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: this.configServise.get('EXPIRES_IN'),
        secret: this.configServise.get('SECRET_KEY'),
      });

      return {
        data: {
          accessToken,
          user: plainToClass(UserDto, user),
        },
        message: 'Login successfully.',
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user: UserDto = await this.prisma.users.findFirst({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.pass_word);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async register({ email, fulName, pass }: RegisterAuthDto) {
    // Check email có tồn tại chưa
    const user = await this.userService.findOne(email);
    return user;
  }
}
