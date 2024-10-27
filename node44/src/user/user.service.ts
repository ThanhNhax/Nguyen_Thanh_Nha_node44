import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private pisma = new PrismaClient();
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const user = await this.pisma.users.findMany();
    return user.map((user) => plainToClass(UserDto, user));
  }

  async findOne(email: string) {
    return await this.pisma.users.findFirst({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
