import { IsNotEmpty } from 'class-validator';

export class BoardDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
