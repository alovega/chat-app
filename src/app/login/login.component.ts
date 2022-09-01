import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    verification: FormGroup;
    login_step = false;
    verification_step = false;

    step =1
  constructor(
    private formBuilder: FormBuilder,
    private loginService: AuthService,
    private router: Router,
    private socket: SocketService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
    });
    this.verification = this.formBuilder.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      code: ['', Validators.required],
      device:['', Validators.required]
    })
  }

  get login() { return this.loginForm.controls; }
  get verificationdetails() { return this.verification.controls;}

  next(){
    if(this.step == 1){
      this.login_step = true;
      if(this.loginForm.invalid) {return}
      let data = this.loginForm.value
      console.log(data)
      this.loginService.login(data).subscribe(response =>{
        if (response.success){
          this.verification.setValue({mobile: data.mobile, code:response.code, device:""})
          this.step++
        }
      })
    }
  }

  previous(){
    this.step--
    if(this.step==1){
      this.verification_step=false;
    }
  }

  submit(){
    if(this.step==2){
      this.verification_step = true;
      if(this.verification.invalid) {return}
      let data = this.verification.value
      this.loginService.verification(data).subscribe(response => {
        if(response.success){
          this.router.navigate([''])
          console.log(response)
          this.socket.userSocket({userId:response.payload.id, username:response.payload.user.username})
          this.socket.getUserRooms({userId:response.payload.id, username:response.payload.user.username})
          sessionStorage.setItem('token', `${response.authorization}`)
          sessionStorage.setItem('username',`${response.payload.user.username}`)
          sessionStorage.setItem('userId', `${response.payload.id}`)
        }
      })
    }
  }

}
