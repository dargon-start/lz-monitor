import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @SetMetadata('role', ['admin', 'user'])
  @ApiOperation({
    summary: '测试admin',
    description: '请求该接口需要admin权限',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: '用户名',
  })
  findAll(@Query('name') name: string) {
    console.log(name);
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '用户id', required: true })
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id);
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
