import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.intereceptor';
import { ApiExceptionFilter } from 'src/common/filters/exception-filter';
import { AuthTokenGuards } from 'src/auth/guards/auth.guards';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { BodyCreateTaskInterceptor } from 'src/common/interceptors/body-create-task.interceptor';
import { CreateTaskDto } from './dto/create-task.dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskEntity } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { TokenPayloadParam } from 'src/param/token-payload.param';

@Controller('tasks')
@UseFilters(ApiExceptionFilter)
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

  @UseGuards(AuthTokenGuards)
  @Post()
  @UseInterceptors(BodyCreateTaskInterceptor)
  createTasks(
    @Body() CreateTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.tasksService.createTask(CreateTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuards)
  @Patch(':id')
  partialUpdateTask(
    @Param('id', ParseIntPipe) id: number, 
    @Body() UpdateTaskDto: UpdateTaskDto, 
    @TokenPayloadParam() tokenPayload: PayloadTokenDto
  ) {
    console.log('Token Payload NO CONTROLLER:', tokenPayload);
    return this.tasksService.partialUpdateTask(id, UpdateTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuards)
  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto
  ) {
    return this.tasksService.deleteTask(id, tokenPayload);
  }
}
