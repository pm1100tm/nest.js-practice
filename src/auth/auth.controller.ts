import { GetUser } from './get-user.decorator';
import { Controller, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserDTO } from './dto/user-dto';
import { User } from './entity/user.entity';
import { AuthService } from './../auth/auth.service';
import { Post, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class AuthController {
  constructor(private userService: AuthService) {}

  /** */
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) userDTO: UserDTO,
  ): Promise<{ accessToken: string }> {
    console.log('controller: signIn', userDTO);
    return this.userService.signIn(userDTO);
  }

  /** */
  @Post('/signup')
  createUser(@Body(ValidationPipe) userDTO: UserDTO): Promise<User> {
    console.log('controller:createUser', userDTO);
    return this.userService.createUser(userDTO);
  }

  /** */
  @Post('/auth-test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('auth-test !!');
    console.log(user);
  }
}
