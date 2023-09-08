import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  lastValueFrom,
  startWith,
  switchMap,
  Subject,
  BehaviorSubject,
  tap,
} from 'rxjs';
import { environments } from '../environment/environments';
import { User_model } from '../models/user/user.model';
import { KanbanService } from './kanban.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public http: HttpClient, public kanban: KanbanService) {}

  updateUser = new Subject<void>();
  currentUser: any = new BehaviorSubject<any>(null);
  token: BehaviorSubject<any> = new BehaviorSubject(null);
  isAdmin$ = new BehaviorSubject<boolean>(false);
  admin_info = new BehaviorSubject<number>(0);

  loginwithUsernameandEmail(username: string, password: string) {
    const body = { username: username, password: password };
    this.http.post<any>(environments.loginUrl, body).subscribe(async (res) => {
      localStorage.setItem('usertoken', res.token);

      this.currentUser.next(await res);
    });
    return this.currentUser;
  }

  getAllUsers() {
    const users = this.updateUser.pipe(
      startWith({}),
      switchMap(() => this.http.get<any>(environments.usersUrl))
    );

    return users;
  }

  createUser(User: User_model) {
    return lastValueFrom(this.http.post<any>(environments.registerUrl, User));
  }

  checkUserGroup() {
    const user = this.currentUser.getValue();
    let badgeNumber: number = 0;

    this.getAllUsers().subscribe((res: any) => {
      res.forEach((element: any) => {
        if (element.groups.length == 0) {
          badgeNumber++;

          this.admin_info.next(badgeNumber);
        }
        if (element.id == user.user_id) {
          if (element.groups.length == 0 || element.groups[0].name == 'user') {
            this.isAdmin$.next(false);
          } else {
            this.isAdmin$.next(true);
          }
        }
      });
    });
  }

  setLogout() {
    this.kanban.setNull();
    localStorage.removeItem('usertoken');
    this.currentUser.next(null);
    this.isAdmin$.next(null);
    this.updateUser.next(null);
  }

  updateUserData(User) {
    const user = this.http
      .put<any>(environments.usersUrl + `${User.id}/`, User)
      .pipe(
        tap(() => {
          this.updateUser.next();
        })
      );
    return user;
  }

  changePW(id, body) {
    const pw = this.http
      .put<any>(environments.changePW + `${id}/`, body)
      .pipe(tap(() => {}));
    return pw;
  }
}
