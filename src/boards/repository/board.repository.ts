import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Board } from '../entity/board.entity';
import { BoardDTO } from '../dto/board-dto';
import { BoardStatus } from '../board-status.enum';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  /** 특정 게시물 가져오기 */
  async getBoardById(id: number): Promise<Board> {
    return await this.findOne(id);
  }

  /** 특정 유저의 모든 게시물 가져오기 */
  async getBoardsByUser(user: User): Promise<Board[]> {
    const query = this.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });
    const boards = await query.getMany();
    return boards;
  }

  /** 게시물 생성하기 */
  async createBoard(boardDTO: BoardDTO, user: User): Promise<Board> {
    const { title, description } = boardDTO;
    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    await this.save(board);
    return board;
  }

  /** 게시물 삭제하기 */
  async deleteBoard(id: number, user: User): Promise<number> {
    const result = this.delete({ id, user });
    return (await result).affected;
  }
}
