import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAllTasks(): Promise<Array<{ id: number; title: string; description: string }>> {
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.tasksService.findOneTaskById(id);
  }

  @Post()
  createTasks(@Body() body: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.createTask(body.title, body.description);
  }

  @Put(':id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto): Promise<TaskEntity> {
    return this.tasksService.updateTotalTask(id, body);
  }

  @Patch(':id')
  partialUpdateTask(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.tasksService.partialUpdateTask(id, body);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
