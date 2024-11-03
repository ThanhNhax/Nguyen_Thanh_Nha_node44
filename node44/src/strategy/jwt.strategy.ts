import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { KeyService } from 'src/key/key.service';

//@Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: config.get('SECRET_KEY'),
//     });
//   }
//   prisma = new PrismaClient();
//   async validate(tokenDecode: any) {
//     console.log({ tokenDecode });
//     const userId = tokenDecode.sub;
//     const checkUser = await this.prisma.users.findFirst({
//       where: { user_id: userId },
//     });
//     if (!checkUser) {
//       return false;
//     }
//     return tokenDecode;
//   }
// }

// Dung cho khóa bất đối xứng
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, keyService: KeyService) {
    const publicKey = keyService.getPublicKey();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithm: ['RS256'],
      secretOrKey: publicKey,
    });
  }
  prisma = new PrismaClient();
  async validate(tokenDecode: any) {
    console.log({ tokenDecode });
    const userId = tokenDecode.sub;
    const checkUser = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });
    if (!checkUser) {
      return false;
    }
    return tokenDecode;
  }
}
