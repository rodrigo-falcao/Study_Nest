import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuards } from 'src/auth/guards/auth.guards';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/auth/commom/auth.constants';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }

  @UseGuards(AuthTokenGuards)
  @Get()
  findAllUsers(@Req() req: Request) {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findOneUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneUserById(id);
  }

  @Put(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id')
  updatePartialUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.partialUpdateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}