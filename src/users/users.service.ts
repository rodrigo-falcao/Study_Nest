import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.users.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: createUserDto.password,
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
      }
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(id:number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          passwordHash: updateUserDto.password,
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

  async partialUpdateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.users.update({
        where: { id },
        data: {
          name: updateUserDto?.name,
          email: updateUserDto?.email,
          passwordHash: updateUserDto?.password,
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

  async deleteUser(id: number) {
    try {
      await this.prisma.users.delete({
        where: { id }
      });
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      throw new HttpException(`Error deleting user ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
