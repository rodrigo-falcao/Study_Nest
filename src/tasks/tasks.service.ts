import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskEntity } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks() {
    return await this.prisma.tasks.findMany();
  }

  async findOneTaskById(id: number): Promise<TaskEntity> {
    const task = await this.prisma.tasks.findUnique({ where: { id } });
    if (!task) {
      throw new HttpException(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return task;
  }

  async createTask(title: string, description: string): Promise<TaskEntity> {
    if (!title || !description) {
      throw new HttpException('Title and description are required', HttpStatus.BAD_REQUEST);
    }
    const newTask = await this.prisma.tasks.create({
      data: {
        title,
        description,
        completed: false,
      },
    });
    return newTask;
  }

  async updateTotalTask(id: number, body: UpdateTaskDto): Promise<TaskEntity> {
    if (!body.title || !body.description || body.completed === undefined) {
      throw new HttpException('Title, description and completed status are required', HttpStatus.BAD_REQUEST);
    }
    await this.findOneTaskById(id);
    return await this.prisma.tasks.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed,
      },
    });
  }

  async partialUpdateTask(id: number, body: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.findOneTaskById(id);
    return await this.prisma.tasks.update({
    where: { id },
    data: {
      title: body.title ?? task.title,
      description: body.description ?? task.description,
      completed: body.completed ?? task.completed,
    },
  });
}

  async deleteTask(id: number): Promise<{ message: string }> {
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
