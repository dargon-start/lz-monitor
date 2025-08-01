import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: '用户名',
    example: 'JohnDoe',
  })
  name: string;

  @IsInt()
  @ApiProperty({
    description: '年龄',
    example: 30,
  })
  age: number;
}
