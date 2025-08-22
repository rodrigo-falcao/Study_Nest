import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskEntity } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { BodyCreateTaskInterceptor } from 'src/common/interceptors/body-create-task.interceptor';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.intereceptor';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseInterceptors(LoggerInterceptor, AddHeaderInterceptor)
  findAllTasks(@Query() PaginationDto: PaginationDto): Promise<TaskEntity[]> {
    return this.tasksService.findAllTasks(PaginationDto);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.tasksService.findOneTaskById(id);
  }

  @Post()
  @UseInterceptors(BodyCreateTaskInterceptor)
  createTasks(@Body() body: CreateTaskDto) {
    return this.tasksService.createTask(body.title, body.description);
  }

  @Put(':id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() UpdateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTotalTask(id, UpdateTaskDto);
  }

  @Patch(':id')
  partialUpdateTask(@Param('id', ParseIntPipe) id: number, @Body() UpdateTaskDto: UpdateTaskDto) {
    return this.tasksService.partialUpdateTask(id, UpdateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
