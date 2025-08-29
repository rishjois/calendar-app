import { Injectable, signal } from '@angular/core';
import { Task } from '../models/TaskList';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  taskManagerItems = signal<Task[]>([]);
  private nextId = 1;
  user: string = "";

  constructor() { }

  updateItems(jsonValue: any) {
    const tasks = this.transformTaskJsonToTasks(jsonValue);
    this.taskManagerItems.set(tasks);
    this.nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  }

  updateUser(userInput: string) {
    this.user = userInput;
  }

  addTask(title: string, deadline: string = '') {
    const newTask: Task = {
      id: this.nextId++,
      title,
      deadline,
      completed: false,
      subtasks: []
    };
    this.taskManagerItems.update(tasks => [...tasks, newTask]);
  }

  modifyTask(id: number, updates: Partial<Task>) {
    this.taskManagerItems.update(tasks =>
      tasks.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  deleteTask(id: number) {
    this.taskManagerItems.update(tasks => tasks.filter(t => t.id !== id));
  }

  transformTaskJsonToTasks(json: any): Task[] {
    if (!json || !Array.isArray(json.tasks)) return [];
  
    return json.tasks.map((task: any) => this.transformTask(task));
  }

  transformTask(task: any): Task {
    return {
      id: task.id,
      title: task.title,
      deadline: task.deadline || '',
      completed: !!task.completed,
      subtasks: Array.isArray(task.subtasks)
        ? task.subtasks.map((t: any) => this.transformTask(t))
        : []
    };
  }
}
