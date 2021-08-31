import { Injectable, UnauthorizedException, Logger, } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import * as config from 'config'
const JWT_CONFIG = config.get('jwt')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  static className() {
    return this.name;
  }

  private logger = new Logger(JwtStrategy.className());

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_CONFIG || JWT_CONFIG.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    this.logger.verbose(`validate - payload ${JSON.stringify(payload)}`)
    const { username } = payload;
    const user: User = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('인증되지 않은 유저입니다.');
    }

    return user;
  }
}
