import { IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  toStatus!: string;

  @IsString()
  remarks!: string;
}
