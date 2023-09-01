import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  UserForm: FormGroup<any>;
  PasswordForm: FormGroup<any>;
  errMessage: boolean = false;
  message: boolean = false;
  currentUser: any = {};

  constructor(
    private as: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.UserForm = this.fb.group({
      username: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.as.currentUser.subscribe((user) => {
      if (user !== null) {
        const userid = user.user_id;
        this.loadUsers(userid);
        this.createPWForm();
      }
    });
  }

  loadUsers(userid) {
    this.as.getAllUsers().subscribe(async (users) => {
      await users.forEach((user) => {
        if (userid == user.id) {
          this.currentUser = user;
          const element = user;
        }
      });
      if (this.currentUser !== null) {
        this.createUserform(this.currentUser);
      }
    });
  }

  createUserform(user) {
    console.log('Vor Form', user);
    this.UserForm = new FormGroup({
      username: new FormControl(user.username, Validators.required),
      first_name: new FormControl(user.first_name, Validators.required),
      last_name: new FormControl(user.last_name, Validators.required),
      email: new FormControl(user.email, Validators.required),
    });
  }

  createPWForm() {
    this.PasswordForm = this.fb.group({
      password: ['', Validators.required],
      password2: ['', Validators.required],
      old_password: ['', Validators.required],
    });
  }

  saveUserchanges() {
    const changes = this.UserForm.value;
    this.currentUser.username = changes.username;
    this.currentUser.first_name = changes.first_name;
    this.currentUser.last_name = changes.last_name;
    this.currentUser.email = changes.email;
    this.as.updateUserData(this.currentUser).subscribe((res) => {
      console.log('Änderung erfolgreich', res);
    });
    this.message = true;
    setTimeout(() => {
      this.message = false;
    }, 1000);
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
