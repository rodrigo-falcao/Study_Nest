import { AuthTokenGuards } from 'src/auth/guards/auth.guards';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { TokenPayloadParam } from 'src/param/token-payload.param';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findOneUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneUserById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthTokenGuards)
  @Patch(':id')
  updatePartialUser(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto
  ) {
    return this.usersService.partialUpdateUser(id, updateUserDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuards)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number, 
    @TokenPayloadParam() tokenPayload: PayloadTokenDto
  ) {
    return this.usersService.deleteUser(id, tokenPayload);
  }

  @UseGuards(AuthTokenGuards)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 50,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto
  ) {
    return this.usersService.uploadAvatar(file, tokenPayload);
  }
}