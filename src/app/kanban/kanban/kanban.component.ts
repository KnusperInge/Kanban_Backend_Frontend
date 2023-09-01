import { Component, OnInit } from '@angular/core';
import { KanbanService } from 'src/app/services/kanban.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskComponent } from '../task/task.component';
import { MatDialog } from '@angular/material/dialog';

export interface DialogData {
  change: false;
  task: '';
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  allTasks: any = [];
  is_todo = [];
  is_inprogress = [];
  is_awaitfeedback = [];
  is_done: any = [];

  constructor(private ts: KanbanService, private dialog: MatDialog) {}

  ngOnInit() {
    this.ts.loadTask();
    this.ts.tasks.subscribe((res) => {
      console.log('Tasks', res);
      this.allTasks = res;
      if (this.allTasks !== null) {
        console.log(this.allTasks);
        this.clearArr();
        this.sortTasks();
      } else {
        this.allTasks = {};
      }
    });
  }

  sortTasks() {
    this.allTasks.forEach((task: any) => {
      if (task.status == 'todo') {
        this.is_todo.push(task);
      }
      if (task.status == 'in_progress') {
        this.is_inprogress.push(task);
      }
      if (task.status == 'await_feedback') {
        this.is_awaitfeedback.push(task);
      }
      if (task.status == 'done') {
        this.is_done.push(task);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const task: any = event.container.data;
    task[0].status = event.container.id;

    this.ts.updateTask(task[0]).subscribe((res) => {
      console.log('Änderung erfolgreich', res);
      this.clearArr();
    });
  }

  clearArr() {
    this.is_todo.splice(0);
    this.is_inprogress.splice(0);
    this.is_awaitfeedback.splice(0);
    this.is_done.splice(0);
  }

  console() {
    console.log('is Todo', this.is_todo);
    console.log('is in progress', this.is_inprogress);
    console.log('is Await feedback', this.is_awaitfeedback);
    console.log('is Done', this.is_done);
  }

  openDialog(change, task?) {
    this.dialog.open(TaskComponent, {
      data: {
        task: task,
        change: change,
      },
    });
  }
}
