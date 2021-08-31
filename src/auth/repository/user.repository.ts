import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserDTO } from '../dto/user-dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /** */
  async signIn(username: string): Promise<User> {
    console.log('repo: signIn', username);
    return await this.findOne({ username });
  }

  /** */
  async createUser(userDTO: UserDTO): Promise<User> {
    console.log('repo: createUser');
    try {
      const user: UserDTO = this.create({
        username: userDTO.username,
        password: userDTO.password,
        isActive: userDTO.isActive,
      });
      return await this.save(user);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log(err);
        throw new ConflictException('Existing username');
      } else {
        console.log(err);
        throw new InternalServerErrorException('Server Error');
      }
    }
  }

  /** */
  async deleteUser(id: number): Promise<number> {
    const result = this.delete(id);
    return (await result).affected;
  }
}
