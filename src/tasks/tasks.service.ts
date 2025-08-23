import { CreateTaskDto } from './dto/create-task.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskEntity } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(PaginationDto?: PaginationDto): Promise<TaskEntity[]> {
    const { limit = 10, page = 1 } = PaginationDto || {};
    const offset = (page - 1) * limit;
    return await this.prisma.tasks.findMany({
      take: limit,
      skip: offset
    });
  }

  async findOneTaskById(id: number): Promise<TaskEntity> {
    const task = await this.prisma.tasks.findUnique({ where: { id } });
    if (!task) {
      throw new HttpException(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return task;
  }

  async createTask(CreateTaskDto: CreateTaskDto, tokenPayload: PayloadTokenDto): Promise<TaskEntity> {
    if (!CreateTaskDto.title || !CreateTaskDto.description) {
      throw new HttpException('Title and description are required', HttpStatus.BAD_REQUEST);
    }
    try {
      const newTask = await this.prisma.tasks.create({
        data: {
          title: CreateTaskDto.title,
          description: CreateTaskDto.description,
          completed: false,
          userId: tokenPayload.id
        },
      });
      return newTask;
    } catch (error) {
      throw new HttpException('Error creating task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async partialUpdateTask(id: number, updateTaskDto: UpdateTaskDto, tokenPayload: PayloadTokenDto) {
    console.log('Token Payload:', tokenPayload);
    if (!tokenPayload) {
      throw new HttpException('Token payload não recebido', HttpStatus.FORBIDDEN);
    }
    const task = await this.findOneTaskById(id);
    if (task.userId !== tokenPayload.id) {
      throw new HttpException('You are not allowed to update this task', HttpStatus.FORBIDDEN);
    }
    return await this.prisma.tasks.update({
      where: { id },
      data: {
        title: updateTaskDto.title ?? task.title,
        description: updateTaskDto.description ?? task.description,
        completed: updateTaskDto.completed ?? task.completed
      },
    });
  }

  async deleteTask(id: number, tokenPayload: PayloadTokenDto): Promise<{ message: string }> {
    if (!tokenPayload) {
      throw new HttpException('Token payload não recebido', HttpStatus.FORBIDDEN);
    }
    const task = await this.findOneTaskById(id);
    if (task.userId !== tokenPayload.id) {
      throw new HttpException('You are not allowed to delete this task', HttpStatus.FORBIDDEN);
    }
    try {
      await this.prisma.tasks.delete({ where: { id } });
      return { message: `Task com ID ${id} foi excluída com sucesso!` };
    } catch (error: any) {
        if (error.code === 'P2025') { 
        throw new HttpException(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(`Error deleting task with ID ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
