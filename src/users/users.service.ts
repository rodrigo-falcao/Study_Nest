import { CreateUserDto } from './dto/create-users.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { promises as fs } from 'fs';
import { UpdateUserDto } from './dto/update-user.dto';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly authService: HashingServiceProtocol,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.users.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: await this.authService.hash(createUserDto.password),
        },
        select: {
          id: true,
          email: true,
          name: true,
        }
      });
      return user;
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllUsers() {
    const users = await this.prisma.users.findMany();
    if (!users || users.length === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    } 
    return users;
  }

  async findOneUserById(id: number) {
    const user = await this.prisma.users.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        tasks: true,
        avatar: true
      }
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(id:number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.name || !updateUserDto.email || !updateUserDto.password) {
      throw new HttpException('All fields (name, email, password) must be provided for update', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          passwordHash: await this.authService.hash(updateUserDto.password),
        },
        select: {
          id: true,
          email: true,
          name: true,
        }
      });
      return user;
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async partialUpdateUser(id: number, updateUserDto: UpdateUserDto, tokenPayload: PayloadTokenDto) {
    try {
      const user = await this.prisma.users.findUnique({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.id !== tokenPayload.id) {
        throw new HttpException('You are not allowed to update this user', HttpStatus.FORBIDDEN);
      }
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: {
          name: updateUserDto.name ? updateUserDto.name : user.name,
          passwordHash: updateUserDto?.password ? await this.authService.hash(updateUserDto.password) : user.passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
        }
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number, tokenPayload: PayloadTokenDto) {
    try {
      const user = await this.prisma.users.findUnique({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user.id !== tokenPayload.id) {
        throw new HttpException('You are not allowed to delete this user', HttpStatus.FORBIDDEN);
      }
      await this.prisma.users.delete({
        where: { id }
      });
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      throw new HttpException(`Error deleting user ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadAvatar(file: Express.Multer.File, tokenPayload: PayloadTokenDto) {
    try{
      const mimeType = file.mimetype;
      const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
      const fileName = `${tokenPayload.id}.${fileExtension}`;
      const fileLocation = path.resolve(process.cwd(), 'uploadsFiles', fileName);
      await fs.writeFile(fileLocation, file.buffer);

      const user = await this.prisma.users.findUnique({ where: { id: tokenPayload.id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const updatedUser = await this.prisma.users.update({ where: { id: user.id }, data: { avatar: fileName }, select: { id: true, name: true, email: true, avatar: true } });

      return updatedUser;
    }catch(err) {
      console.error(err);
      throw new HttpException('Error uploading avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
