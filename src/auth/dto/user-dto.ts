import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number.',
  })
  public password: string;

  @IsBoolean()
  @IsNotEmpty()
  public isActive: boolean = true;

  public toString(): string {
    return this.username + this.password + String(this.isActive);
  }
}
