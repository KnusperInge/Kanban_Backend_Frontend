import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) {}

  username: string = '';
  password: string = '';
  response: any;
  login() {
    try {
      this.auth
        .loginwithUsernameandEmail(this.username, this.password)
        .subscribe((user) => {
          if (user !== null) {
            this.auth.checkUserGroup();
            this.router.navigate(['/board']);
          }
        });
    } catch (e) {
      console.log('Irgendwas ist schief gelaufen', e);
      this.router.navigate(['/login']);
    }
  }
}
