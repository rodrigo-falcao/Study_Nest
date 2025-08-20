import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entities/task.entity';

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
  createTasks(@Body() Body: any) {
    const { title, description } = Body;
    return this.tasksService.createTask(title, description);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() body: any) {
    const { title, description } = body;
    return this.tasksService.updateTask(Number(id), title, description);
  }

  @Patch(':id')
  partialUpdateTask(@Param('id') id: string, @Body() Body: any) {
    const { title, description } = Body;
    return this.tasksService.partialUpdateTask(Number(id), title, description);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(Number(id));
  }
}
