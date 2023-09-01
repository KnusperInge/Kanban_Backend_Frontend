import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../kanban/kanban.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KanbanService } from 'src/app/services/kanban.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  TaskForm: FormGroup<any>;
  change: boolean = false;
  buildmode: boolean = false;
  subtaskprogress: number = 0;
  Task: any = {};
  subtasks: any = [];
  users: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<TaskComponent>,
    private fb: FormBuilder,
    private ts: KanbanService,
    private as: AuthService
  ) {
    this.checkTask(data);
    this.getUsers();
    this.change = data.change;

    this.TaskForm = this.fb.group({
      title: [this.Task.title, Validators.required],
      description: [this.Task.description, Validators.required],
      author: [this.Task.author],
      users: [this.Task.users],
    });
  }

  Subtask_Progress() {
    const arr = [];
    this.subtasks.forEach((element) => {
      if (element.status == 'done') arr.push(element);
    });
    this.subtaskprogress = (arr.length * 100) / this.subtasks.length;
  }

  checkTask(data: any) {
    if (data.task === undefined) {
      this.Task = {};
    } else {
      console.log(data.task.subtasks);
      this.Task = data.task;

      if (this.Task.subtasks.length > 0) {
        this.Task.subtasks.forEach((element) => {
          this.subtasks.push(element);
        });
        this.Subtask_Progress();
      }
    }
  }

  changebuildmode() {
    this.buildmode = !this.buildmode;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getUsers() {
    this.as.getAllUsers().subscribe((res) => {
      res.forEach((user: any) => {
        // const test = user.groups[0].name;
        // console.log(test);
        if (user.groups.length == 0 || user.groups[0].name == 'user') {
          this.users.push(user);
        }
      });
    });
  }

  addSubtask(sub: string) {
    const subtask = { id: 0, message: sub, status: '' };
    this.subtasks.push(subtask);
    console.log(this.subtasks);
  }

  changeSubtask(id: any, status: string) {
    this.subtasks[id].status = status;
    console.log(this.subtasks);
    this.Subtask_Progress();
  }

  createTask() {
    const Task = this.TaskForm;
    Task.addControl('subtasks', this.fb.array(this.subtasks));
    this.ts.createTask(this.TaskForm.value).subscribe((res) => {
      console.log('Gesendet', res.title);
    });
    this.closeDialog();
  }

  updateTask() {
    const Task = this.TaskForm;
    Task.addControl('subtasks', this.fb.array(this.subtasks));
    Task.addControl('id', this.fb.control(this.Task.id));
    this.ts.updateTask(this.TaskForm.value).subscribe((res) => {
      console.log('Änderung erfolgreich', res.title);
    });
    this.changebuildmode();
    this.closeDialog();
  }

  deleteTask() {
    this.ts.deleteTask(this.Task.id).subscribe((res) => {
      console.log('delete successfully', res);
    });
    this.closeDialog();
  }
}
