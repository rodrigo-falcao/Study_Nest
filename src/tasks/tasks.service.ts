import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks: Array<{ id: number; title: string; description: string }> = [
    { id: 1, title: 'Tarefa 1', description: 'Descrição da Tarefa 1' },
    { id: 2, title: 'Tarefa 2', description: 'Descrição da Tarefa 2' },
    { id: 3, title: 'Tarefa 3', description: 'Descrição da Tarefa 3' },
  ];

  findAllTasks(): Array<{ id: number; title: string; description: string }> {
    return this.tasks;
  }

  findOneTaskById(id: number): { id: number; title: string; description: string } | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(title: string, description: string): { id: number; title: string; description: string } {
    const tasks = this.findAllTasks();
    const newTask = {
      id: tasks.length + 1,
      title,
      description,
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
