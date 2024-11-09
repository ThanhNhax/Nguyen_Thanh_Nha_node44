import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { EmailDto } from './dto/email.dto';
import { MailService } from 'src/email/email.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: MailService,
  ) {}

  @Post('/login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginAuthDto);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Post('/register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('/send-email')
  @ApiBody({ type: EmailDto })
  async senEmail(@Body() body: EmailDto, @Res() res: Response) {
    let emailTo = body.email;
    let subject = body.subject;
    let text = body.text;
    await this.emailService.sendMail(emailTo, subject, text);
    return res.status(200).json({ message: 'Send mail successfully' });
  }
}
