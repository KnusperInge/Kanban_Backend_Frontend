import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../environment/environments';
import {
  Subject,
  lastValueFrom,
  startWith,
  switchMap,
  tap,
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import { Task_model } from '../models/task/task.model';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  constructor(public http: HttpClient) {}

  url = environments.tasksUrl;
  taskUpdate = new Subject<void>();
  tasks = new BehaviorSubject<any>(null);
  getTasks() {
    const task = this.taskUpdate.pipe(
      startWith({}),
      switchMap(() => this.http.get<any>(this.url))
    );

    return task;
  }
  test: Subscription;
  loadTask() {
    this.test = this.getTasks().subscribe((element) => {
      this.tasks.next(element);
    });
  }
  setNull() {
    this.tasks.next(null);
    this.taskUpdate.next(null);
    console.log(this.tasks.value);
    this.test.unsubscribe();
  }

  createTask(Task: Task_model) {
    const task = this.http.post<any>(this.url, Task).pipe(
      tap(() => {
        this.taskUpdate.next();
      })
    );
    return task;
  }

  updateTask(Task: Task_model) {
    console.log('Final Task:', Task);
    const update_Task = this.http
      .patch<any>(this.url + `${Task.id}/`, Task)
      .pipe(
        tap(() => {
          this.taskUpdate.next();
        })
      );
    return update_Task;
  }

  deleteTask(id: number) {
    const changeTodo = this.http.delete<any>(this.url + `${id}/`).pipe(
      tap(() => {
        this.taskUpdate.next();
      })
    );
    return changeTodo;
  }
}
