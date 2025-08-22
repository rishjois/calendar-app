import { Component, inject, OnInit, signal } from '@angular/core';
import { Task } from '../../../models/TaskList';
import { TaskManagerService } from '../../../services/task-manager';
import { TaskListItem } from "./task-list-item/task-list-item";

@Component({
  selector: 'app-task-manager-list',
  imports: [TaskListItem],
  templateUrl: './task-manager-list.html',
  styleUrl: './task-manager-list.scss'
})
export class TaskManagerList implements OnInit {

  taskData = signal<Task[]>([]);
  taskManagerService = inject(TaskManagerService);

  ngOnInit(): void {
    this.taskData.set(this.taskManagerService.taskManagerItems);
  }
}
