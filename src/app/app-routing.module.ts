import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {AppComponent} from './app.component';
import {AuthGuard} from './services/auth.guard';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {path: '', component: AppComponent, canActivate: [AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'chat', component:ChatComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
