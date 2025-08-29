import { TestBed } from '@angular/core/testing';

import { TaskManagerService } from './task-manager';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task', () => {
    service.addTask('Test Task');
    expect(service.taskManagerItems().length).toBe(1);
    expect(service.taskManagerItems()[0].title).toBe('Test Task');
  });

  it('should modify a task', () => {
    service.addTask('Old Title');
    const id = service.taskManagerItems()[0].id;
    service.modifyTask(id, { title: 'New Title' });
    expect(service.taskManagerItems()[0].title).toBe('New Title');
  });

  it('should delete a task', () => {
    service.addTask('Task 1');
    service.addTask('Task 2');
    const id = service.taskManagerItems()[0].id;
    service.deleteTask(id);
    expect(service.taskManagerItems().length).toBe(1);
    expect(service.taskManagerItems()[0].title).toBe('Task 2');
  });
});
