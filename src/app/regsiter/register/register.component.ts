import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User_model } from 'src/app/models/user/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  newUser: FormGroup<any>;
  email = new FormControl('', [Validators.required, Validators.email]);
  response: any;
  message: boolean = false;
  constructor(
    private fb: FormBuilder,
    private as: AuthService,
    private router: Router
  ) {
    this.newUser = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],

      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  async createUser() {
    this.newUser.addControl('email', this.fb.control(this.email.value));
    try {
      this.response = await this.as.createUser(this.newUser.value);
      this.message = true;
      setTimeout(() => {
        this.message = false;
        this.router.navigate(['/login']);
      }, 2000);
      console.log('Res', this.response);
    } catch (e) {
      console.log('Error', e);
    }
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
