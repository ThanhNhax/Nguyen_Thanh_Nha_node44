import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty({ message: 'Email đăng không để trống.' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @ApiProperty()
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải dài ít nhất 6 ký tự.' })
  @ApiProperty() // show ra schema ở swagger
  pass: string;
}
