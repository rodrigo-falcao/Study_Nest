import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: TaskEntity[] = [
    { id: 1, title: 'Tarefa 1', description: 'Descrição da Tarefa 1', completed: false },
    { id: 2, title: 'Tarefa 2', description: 'Descrição da Tarefa 2', completed: true },
    { id: 3, title: 'Tarefa 3', description: 'Descrição da Tarefa 3', completed: false },
  ];

  findAllTasks(): TaskEntity[] {
    return this.tasks;
  }

  findOneTaskById(id: number): TaskEntity  {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(title: string, description: string): TaskEntity {
    const tasks = this.findAllTasks();
    if (!title || !description) {
      throw new HttpException('Title and description are required', HttpStatus.BAD_REQUEST);
    }
    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      completed: false,
    };
    this.tasks.push(newTask);
    console.log('createTask:', newTask);
    return newTask;
  }

  updateTask(id: number, title: string, description: string): TaskEntity {
    const task = this.findOneTaskById(id);
    task.title = title;
    task.description = description;
    return task;
  }

  partialUpdateTask(id: number, title?: string, description?: string): TaskEntity {
    const task = this.findOneTaskById(id);
    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    return task;
  }

  deleteTask(id: number): { message: string } {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      return { message: `Task com ID ${id} foi excluída com sucesso!` };
    }
    throw new NotFoundException(`Task with ID ${id} not found`);
  }
}
