import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { TaskManagerComponent } from './components/task-manager-component/task-manager-component';
import { TaskManagerService } from './services/task-manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent, TaskManagerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'Plannit';

  taskManagerService = inject(TaskManagerService);

  ngOnInit(): void {
    this.taskManagerService.loadUserAndTasks(1); // TODO: replace 1 with the logged-in user's ID
  }
}