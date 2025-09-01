import { Component, computed, inject } from '@angular/core';
import { Task } from '../../models/TaskList';
import { TaskManagerService } from '../../services/task-manager';
import { TaskManagerList } from './task-manager-list/task-manager-list';



@Component({
  selector: 'app-task-manager-component',
  imports: [TaskManagerList],
  templateUrl: './task-manager-component.html',
  styleUrl: './task-manager-component.scss'
})
export class TaskManagerComponent {

  taskManagerService = inject(TaskManagerService);
  user = this.taskManagerService.user;

  firstName = computed(() => this.getPossessiveFirstName(this.user()));

  getPossessiveFirstName(fullName:string) {
    if (!fullName || typeof fullName !== 'string') return '';

    // Trim and extract the first name
    const trimmed = fullName.trim();
    if (trimmed.length === 0) return '';

    const firstName = trimmed.split(/\s+/)[0];

    if (firstName.length === 0) return '';

    // Handle names ending in 's' (e.g., James -> James', Chris -> Chris')
    const endsWithS = /s$/i.test(firstName);

    return endsWithS ? `${firstName}'` : `${firstName}'s`;
  }

  /**
   * Limits tier to 0-3 for styling (font sizes stop shrinking after 3)
   */
  getTierClass(tier: number): string {
    return `tier-${Math.min(tier, 3)}`;
  }

  

  // Initialize
  // renderTaskList(this.taskData());
  
}


/**
  * Renders a task and its subtasks recursively.
  */
function renderTask(task: Task, tier: number): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('task-item', `tier-${Math.min(tier, 3)}`);

  // Checkbox
  const checkbox = document.createElement('span');
  checkbox.classList.add('checkbox');
  if (task.completed) {
    checkbox.classList.add('completed');
  }

  // Task text
  const titleSpan = document.createElement('span');
  titleSpan.textContent = task.title;
  titleSpan.classList.add('task-title');
  if (task.completed) {
    titleSpan.classList.add('completed');
  }

  // Deadline
  const deadlineSpan = document.createElement('span');
  if (task.deadline) {
    deadlineSpan.textContent = ` (Due: ${task.deadline})`;
    deadlineSpan.style.marginLeft = '6px';
    deadlineSpan.style.color = '#555';
    deadlineSpan.style.fontSize = '0.85em';
  }

  // Assemble
  const content = document.createElement('div');
  content.classList.add('task-content');
  content.appendChild(checkbox);
  content.appendChild(titleSpan);
  if (task.deadline) {
    content.appendChild(deadlineSpan);
  }

  container.appendChild(content);

  // Render subtasks recursively
  if (task.subtasks && task.subtasks.length > 0) {
    for (const subtask of task.subtasks) {
      container.appendChild(renderTask(subtask, tier + 1));
    }
  }

  return container;
}

/**
 * Render the entire task list.
 */
export function renderTaskList(tasks: Task[]): void {
  const root = document.getElementById('task-list');
  if (!root) return;

  root.innerHTML = ''; // Clear
  for (const task of tasks) {
    root.appendChild(renderTask(task, 0));
  }
}