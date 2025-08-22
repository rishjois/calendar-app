import { Injectable } from '@angular/core';
import { Task } from '../models/TaskList';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  taskManagerItems: Array<Task> = [];
  user: string = "";
  constructor() { }

  updateItems(jsonValue: any) {
    this.taskManagerItems = this.transformTaskJsonToTasks(jsonValue);
  }

  updateUser(userInput: string) {
    this.user = userInput;
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
