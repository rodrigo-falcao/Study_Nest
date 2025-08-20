import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAllTasks(): Array<{ id: number; title: string; description: string }> {
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): TaskEntity {
    return this.tasksService.findOneTaskById(Number(id));
  }

  @Post()
  createTasks(@Body() body: CreateTaskDto) {
    return this.tasksService.createTask(body.title, body.description);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.updateTask(Number(id), body);
  }

  @Patch(':id')
  partialUpdateTask(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.tasksService.partialUpdateTask(Number(id), body);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
