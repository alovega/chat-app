import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorInterceptor } from './http-interceptor.interceptor';

@NgModule({
  declarations: [AppComponent, SidebarComponent, ChatComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    HttpClientModule,
  ],
  providers: [AuthGuard, {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi:true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
