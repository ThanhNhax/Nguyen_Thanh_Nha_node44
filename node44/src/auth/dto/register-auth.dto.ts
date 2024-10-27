import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty({ message: 'Email đăng không để trống.' })
  fulName: string;

  @IsNotEmpty({ message: 'Email đăng không để trống.' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải dài ít nhất 6 ký tự.' })
  pass: string;
}
