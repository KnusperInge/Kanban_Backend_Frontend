import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Simple_Kanban_Frontend';
  _users: any;
  _isAdmin: any = false;
  _isUser: boolean = false;
  _isVisible = true;
  badge_input: number = 0;
  hidden = false;

  constructor(
    private as: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.as.currentUser.subscribe(async (user) => {
      (await user) ? this.show() : this.hide();
    });
  }

  show() {
    this._isVisible = true;

    this.elementRef.nativeElement.lastChild.style.height = 'calc(100% - 64px)';

    this.as.isAdmin$.subscribe((res) => {
      this._isAdmin = res;
      if (this._isAdmin) {
        this.adminBadge();
      }
    });
  }
  hide() {
    this._isVisible = false;
    this.elementRef.nativeElement.lastChild.style.height = '100%';
  }

  adminBadge() {
    this.as.admin_info.subscribe(async (res) => {
      this.badge_input = res;

      if (this.badge_input >= 1) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    });
  }

  openAdminpanel() {
    this.router.navigate(['/admin']);
  }
  openUserpanel() {
    this.router.navigate(['/user']);
  }
  home() {
    this.router.navigate(['/board']);
  }
  logout() {
    this.as.setLogout();
    this._isAdmin = '';
    this.hidden = true;
    this.router.navigate(['/login']);
  }
}
