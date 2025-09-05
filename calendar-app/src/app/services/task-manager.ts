import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/TaskList';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  taskManagerItems = signal<Task[]>([]);
  private nextId = 1;
  user = signal<string>('');
  private currentUserId: number | null = null;

  constructor(private http: HttpClient) { }

  updateItems(jsonValue: any) {
    const tasks = this.transformTaskJsonToTasks(jsonValue);
    this.taskManagerItems.set(tasks);
    this.nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  }

  updateUser(userInput: string) {
    this.user.set(userInput);
  }

  loadUserAndTasks(userId: number) {
    this.currentUserId = userId;
    this.http.get<any>(`http://localhost:5000/api/users/${userId}`).subscribe({
      next: data => {
        if (data?.user) {
          const name = [data.user.first_name, data.user.last_name]
            .filter(Boolean)
            .join(' ');
          this.user.set(name || data.user.username);
        }
        if (data?.tasks) {
          this.updateItems({ tasks: data.tasks });
        }
      },
      error: err => {
        console.error('Failed to load tasks', err);
      }
    });
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

  addSubtask(parentId: number, title: string, deadline: string = '') {
    const newTask: Task = {
      id: this.nextId++,
      title,
      deadline,
      completed: false,
      subtasks: []
    };
    this.taskManagerItems.update(tasks => this.insertSubtask(tasks, parentId, newTask));
  }

  modifyTask(id: number, updates: Partial<Task>) {
    this.taskManagerItems.update(tasks => this.updateTaskRecursive(tasks, id, updates));
  }

  deleteTask(id: number) {
    this.taskManagerItems.update(tasks => this.deleteTaskRecursive(tasks, id));
  }

  saveTasks() {
    if (this.currentUserId == null) {
      console.error('No user loaded');
      return;
    }
    const payload = { tasks: this.taskManagerItems() };
    this.http.post(`http://localhost:5000/api/users/${this.currentUserId}/tasks`, payload)
      .subscribe({
        next: () => console.log('Tasks saved'),
        error: err => console.error('Failed to save tasks', err)
      });
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

  private insertSubtask(tasks: Task[], parentId: number, subtask: Task): Task[] {
    return tasks.map(t => {
      if (t.id === parentId) {
        return { ...t, subtasks: [...(t.subtasks || []), subtask] };
      }
      if (t.subtasks && t.subtasks.length > 0) {
        return { ...t, subtasks: this.insertSubtask(t.subtasks, parentId, subtask) };
      }
      return t;
    });
  }

  private updateTaskRecursive(tasks: Task[], id: number, updates: Partial<Task>): Task[] {
    return tasks.map(t => {
      if (t.id === id) {
        return { ...t, ...updates };
      }
      if (t.subtasks && t.subtasks.length > 0) {
        return { ...t, subtasks: this.updateTaskRecursive(t.subtasks, id, updates) };
      }
      return t;
    });
  }

  private deleteTaskRecursive(tasks: Task[], id: number): Task[] {
    return tasks
      .filter(t => t.id !== id)
      .map(t => ({
        ...t,
        subtasks: t.subtasks ? this.deleteTaskRecursive(t.subtasks, id) : []
      }));
  }
}
