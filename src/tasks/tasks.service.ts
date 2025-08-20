import { Injectable } from '@nestjs/common';
import { TaskEntity } from './entities/task.entity';
import { error } from 'console';

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

  findOneTaskById(id: number): TaskEntity | undefined {
    const idNum = this.tasks.find(task => task.id === id);
    if (!idNum) {
        console.error('Task not found');
        return undefined;
    }
    return idNum;
  }

  createTask(title: string, description: string): TaskEntity {
    const tasks = this.findAllTasks();
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

  updateTask(id: number, title: string, description: string): { id: number; title: string; description: string } | undefined {
    const task = this.findOneTaskById(id);
    if (task) {
      task.title = title;
      task.description = description;
      return task;
    }
    return undefined;
  }

  partialUpdateTask(id: number, title?: string, description?: string): { id: number; title: string; description: string } | undefined {
    const task = this.findOneTaskById(id);
    if (task) {
      if (title) {
        task.title = title;
      }
      if (description) {
        task.description = description;
      }
      return task;
    }
    return undefined;
  }

  deleteTask(id: number): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      return true;
    }
    return false;
  }
}
