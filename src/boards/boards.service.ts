import { User } from 'src/auth/entity/user.entity';
import { BoardRepository } from './repository/board.repository';
import { BoardDTO } from './dto/board-dto';
import {
  Injectable,
  Param,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { use } from 'passport';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  /** 모든 게시물 가져오기 */
  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async getBoardsByUser(user: User): Promise<Board[]> {
    const boards: Board[] = await this.boardRepository.getBoardsByUser(user);
    return boards;
  }

  /** 특정 게시물 가져오기 */
  async getBoardById(id: number): Promise<Board> {
    const boardInstance = await this.boardRepository.getBoardById(id);
    if (!boardInstance) {
      throw new NotFoundException(`Can't the board with this id ${id}`);
    }
    return boardInstance;
  }

  /** 게시물 생성하기 */
  async createBoard(boardDTO: BoardDTO, user: User): Promise<Board> {
    return this.boardRepository.createBoard(boardDTO, user);
  }

  /** 게시물 변경하기 */
  async updateBoard(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }

  /** 게시물 삭제하기 */
  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.deleteBoard(id, user);
    if (result === 0) {
      throw new NotFoundException(`Can't find a record with this id ${id}`);
    }
  }
}
