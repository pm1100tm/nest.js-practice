import { UserRepository } from './repository/user.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserDTO } from './dto/user-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  /** 생성자 */
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /** 로그인 - 토큰 발행 */
  async signIn(userDTO: UserDTO): Promise<{ accessToken: string }> {
    console.log('service: signIn', userDTO);
    const username = userDTO.username;
    const password = userDTO.password;

    const user = await this.userRepository.signIn(username);
    const userPassword = await user.password;

    if (user && (await bcrypt.compare(password, userPassword))) {
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Please check your password.');
  }

  /** 유저 생성 */
  async createUser(userDTO: UserDTO): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDTO.password, salt);
    userDTO.password = hashedPassword;

    console.log(userDTO.toString());
    return await this.userRepository.createUser(userDTO);
  }
}
