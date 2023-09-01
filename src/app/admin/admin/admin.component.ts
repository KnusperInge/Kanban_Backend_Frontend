import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  UserForm: FormGroup<any>;
  PasswordForm: FormGroup<any>;
  is_Admin: any = [];
  is_User: any = [];
  is_None: any = [];
  allUsers: any = [];
  Userid: any;
  currentUser: any = {};
  errMessage: boolean = false;
  constructor(
    private as: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.as.currentUser.subscribe(async (res: any) => {
      this.Userid = await res.user_id;
      this.loadUsers();
    });
    this.UserForm = this.fb.group({
      username: [''],
      first_name: [''],
      last_name: [''],
      email: [''],
    });
    this.PasswordForm = this.fb.group({
      password: ['', Validators.required],
      password2: ['', Validators.required],
      old_password: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  loadUsers() {
    this.as.getAllUsers().subscribe((res) => {
      this.allUsers = res;
      console.log(this.allUsers);
      this.clearArr();
      this.findCurrentUser();
      this.sortUsers();
      this.createForm();
    });
  }
  findCurrentUser() {
    this.allUsers.forEach((user: any) => {
      if (this.Userid == user.id) {
        this.currentUser = user;
        console.log('Aktueller User', this.currentUser);
      }
    });
  }
  createForm() {
    console.log(Object.keys(this.currentUser).length === 0);

    this.UserForm = new FormGroup({
      username: new FormControl(this.currentUser.username, Validators.required),
      first_name: new FormControl(
        this.currentUser.first_name,
        Validators.required
      ),
      last_name: new FormControl(
        this.currentUser.last_name,
        Validators.required
      ),
      email: new FormControl(this.currentUser.email, Validators.required),
    });
  }
  sortUsers() {
    this.allUsers.forEach((user: any) => {
      if (user.groups.length == 0) {
        this.is_None.push(user);
      }
      if (user.groups[0].name == 'user') {
        this.is_User.push(user);
      }
      if (user.groups[0].name == 'leader') {
        this.is_Admin.push(user);
      }
    });
  }
  clearArr() {
    this.is_None.splice(0);
    this.is_User.splice(0);
    this.is_Admin.splice(0);
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
    const user_id = event.item.element.nativeElement.firstElementChild.id;
    this.allUsers.forEach((element) => {
      if (element.id == user_id) {
        element.groups.push(this.addPermission(event.container.id));

        this.as.updateUserData(element).subscribe((res) => {
          console.log('Erfolgreich geändert', res);
          this.clearArr();
        });
      }
    });
  }
  addPermission(permission) {
    if (permission == 'user') {
      return {
        id: 2,
      };
    } else {
      return {
        id: 1,
      };
    }
  }

  saveUserchanges() {
    console.log('vor Änderung', this.currentUser);
    const changes = this.UserForm.value;
    this.currentUser.username = changes.username;
    this.currentUser.first_name = changes.first_name;
    this.currentUser.last_name = changes.last_name;
    this.currentUser.email = changes.email;
    this.as.updateUserData(this.currentUser).subscribe((res) => {
      console.log('Änderung erfolgreich', res);
    });
  }

  savePassword() {
    const pw = this.PasswordForm.value;
    console.log(this.PasswordForm.value);
    if (pw.password == pw.password2) {
      this.as
        .changePW(this.currentUser.id, this.PasswordForm.value)
        .subscribe((res) => {
          console.log('Änderung erfolgreich', res);
          this.router.navigate(['/login']);
          localStorage.clear();
        });
    } else {
      this.errMessage = true;
      setTimeout(() => {
        this.errMessage = false;
      }, 1000);
    }
  }
}
