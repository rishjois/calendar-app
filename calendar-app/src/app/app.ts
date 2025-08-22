import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { CalendarComponent } from './components/calendar-component/calendar-component';
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

  user = signal<string>('Rishabh R Jois'); // would pull actual user data from database here

  // call service to retrieve User's tasks and subtasks
  // this data will be passed in JSON
  task_json = {
    "tasks": [
      {
        "id": 1,
        "title": "Calendar App",
        "deadline": "",
        "completed": false,
        "subtasks": [
          {
            "id": 2,
            "title": "Design UI",
            "deadline": "2025-06-15",
            "completed": true
          },
          {
            "id": 3,
            "title": "Implement Database Model",
            "deadline": "2025-06-22",
            "completed": false
          }
        ]
      },
      {
        "id": 4,
        "title": "School Project",
        "deadline": "2025-06-15",
        "completed": false,
        "subtasks": [
          {
            "id": 5,
            "title": "Research Topic",
            "deadline": "2025-06-24",
            "completed": false,
            "subtasks": [
              {
                "id": 6,
                "title": "Ask ChatGPT",
                "deadline": "2025-06-21",
                "completed": false,
              },
              {
                "id": 7,
                "title": "Reach out to Professors",
                "deadline": "2025-06-24",
                "completed": false,
                "subtasks": [
                  {
                    "id": 8,
                    "title": "Professor A",
                    "deadline": "2025-06-22",
                    "completed": false
                  },
                  {
                    "id": 9,
                    "title": "Professor B",
                    "deadline": "2025-06-23",
                    "completed": false
                  }
                ]
              }
            ]
          },
          {
            "id": 10,
            "title": "Complete Assignment",
            "deadline": "2025-06-26",
            "completed": false
          }
        ]
      },
      {
        "id": 0,
        "title": "Errands",
        "deadline": "",
        "completed": false,
      }
    ]
  }

  taskManagerService = inject(TaskManagerService);

  ngOnInit(): void {
    this.taskManagerService.updateItems(this.task_json);
    this.taskManagerService.updateUser(this.user());
  }
  
  // taskData = signal<Task[]>(transformTaskJsonToTasks(this.task_json));
  
}