import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './regsiter/register/register.component';
import { LoginComponent } from './login/login/login.component';
import { KanbanComponent } from './kanban/kanban/kanban.component';
import { AdminComponent } from './admin/admin/admin.component';
import { UserComponent } from './user/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'board', component: KanbanComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
