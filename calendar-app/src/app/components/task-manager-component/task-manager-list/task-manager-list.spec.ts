import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagerList } from './task-manager-list';

describe('TaskManagerList', () => {
  let component: TaskManagerList;
  let fixture: ComponentFixture<TaskManagerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskManagerList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskManagerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
