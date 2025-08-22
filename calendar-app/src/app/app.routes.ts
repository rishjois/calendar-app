import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/sidebar-component/sidebar-component').then(
                m => m.SidebarComponent
            )
        },
    },
    {
        path: 'taskmanager',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./components/task-manager-component/task-manager-component').then(
                m => m.TaskManagerComponent
            )
        },
    },
];
