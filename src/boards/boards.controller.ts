import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { BoardValidationPipe } from './pipes/board-validation.pipe';
import { BoardDTO } from './dto/board-dto';
import { Board } from './entity/board.entity';
import { BoardStatus } from './board-status.enum';
import { BoardsService } from './../boards/boards.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('boards')
export class BoardsController {
  static className() {
    return this.name;
  }

  private logger = new Logger(BoardsController.className());
  constructor(private boardsService: BoardsService) {}

  /** Repository
   *  모든 게시물 가져오기
   */
  @Get('/')
  getAllBoards(): Promise<Board[]> {
    this.logger.verbose('GET - getAllBoards');
    return this.boardsService.getAllBoards();
  }

  /** Repository
   *  특정 유저가 작성한 게시물 가져오기
   */
  @Get('/user/:id')
  @UseGuards(AuthGuard())
  getBoardsByUser(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`GET - getBoardsByUser ${JSON.stringify(user)}`);
    return this.boardsService.getBoardsByUser(user);
  }

  /** Repository
   *  특정 게시물 1개 가져오기
   */
  @Get('/:id')
  @UseGuards(AuthGuard())
  getBoardById(@Param('id') id: number): Promise<Board> {
    this.logger.verbose(`GET - getBoardById ${id}`);
    return this.boardsService.getBoardById(id);
  }

  /** Repository
   *  게시물 작성하기
   */
  @Post('/')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  createBoard(
    @Body() boardDTO: BoardDTO,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(`POST - createBoard ${JSON.stringify(user)}, ${BoardDTO}`);
    return this.boardsService.createBoard(boardDTO, user);
  }

  /** Repository
   *  게시물 변경하기
   */
  @Patch('/:id/status')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, status);
  }

  /** Repository
   *  게시물 삭제하기
   */
  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  deleteBoard(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }
}
