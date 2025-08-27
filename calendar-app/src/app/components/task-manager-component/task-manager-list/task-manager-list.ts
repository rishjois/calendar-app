import { Component, inject } from '@angular/core';
import { TaskManagerService } from '../../../services/task-manager';
import { TaskListItem } from "./task-list-item/task-list-item";

@Component({
  selector: 'app-task-manager-list',
  imports: [TaskListItem],
  templateUrl: './task-manager-list.html',
  styleUrl: './task-manager-list.scss'
})
export class TaskManagerList {

  taskManagerService = inject(TaskManagerService);
  taskData = this.taskManagerService.taskManagerItems;

  addTask() {
    const title = prompt('Task title');
    if (title) {
      const deadline = prompt('Task deadline (optional, YYYY-MM-DD)') || '';
      this.taskManagerService.addTask(title, deadline);
    }
  }
}
