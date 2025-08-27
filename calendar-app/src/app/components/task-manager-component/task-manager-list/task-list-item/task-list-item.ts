import { Component, computed, inject, input, signal } from '@angular/core';
import { Task } from '../../../../models/TaskList';
import { TaskManagerService } from '../../../../services/task-manager';

@Component({
  selector: 'app-task-list-item',
  imports: [],
  templateUrl: './task-list-item.html',
  styleUrl: './task-list-item.scss'
})
export class TaskListItem {
  task = input.required<Task>();
  depth = input<number>(0);

  taskManagerService = inject(TaskManagerService);

  expanded = signal<boolean>(true);

  hasChildren = computed(
    () => Array.isArray(this.task().subtasks) && this.task().subtasks!.length > 0
  );

  toggle() {
    if (this.hasChildren()) this.expanded.set(!this.expanded());
  }

  onCompletedChange(evt: Event) {
    this.task().completed = (evt.target as HTMLInputElement).checked;
  }

  modifyTask() {
    const title = prompt('New title', this.task().title);
    const deadline = prompt('New deadline (optional, YYYY-MM-DD)', this.task().deadline) || '';
    if (title !== null) {
      this.taskManagerService.modifyTask(this.task().id, { title, deadline });
    }
  }

  deleteTask() {
    if (confirm('Delete task?')) {
      this.taskManagerService.deleteTask(this.task().id);
    }
  }
}
