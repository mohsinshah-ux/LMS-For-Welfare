import { IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  applicationId!: string;

  @IsString()
  fromStatus!: string;

  @IsString()
  toStatus!: string;

  @IsString()
  remarks!: string;
}
