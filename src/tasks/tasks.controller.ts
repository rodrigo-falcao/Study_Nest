import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAllTasks(): Array<{ id: number; title: string; description: string }> {
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): { id: number; title: string; description: string } {
    const task = this.tasksService.findOneTaskById(Number(id));
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Post()
  createTasks(@Body() Body: any) {
    const { title, description } = Body;
    if (!title || !description) {
      throw new NotFoundException('Title and description are required');
    }
    return this.tasksService.createTask(title, description);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() body: any) {
    console.log('body recebido:', body);
    if (!body || !body.title || !body.description) {
      throw new NotFoundException('Title and description are required');
    }
    const { title, description } = body;
    const updatedTask = this.tasksService.updateTask(Number(id), title, description);
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  @Patch(':id')
  partialUpdateTask(@Param('id') id: string, @Body() Body: any) {
    const { title, description } = Body;
    const updatedTask = this.tasksService.partialUpdateTask(Number(id), title, description);
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    const deleted = this.tasksService.deleteTask(Number(id));
    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
