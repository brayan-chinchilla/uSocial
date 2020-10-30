import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showRegister: boolean = false;

  loginForm: FormGroup = this.fb.group({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  registerForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    photo: new FormControl('', Validators.required),
  })

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  goToRegister() {
    this.showRegister = true;
  }

  goToLogin() {
    this.showRegister = false;
  }

  onSubmitLogin(value: any) {
    console.log(value)
    this.authService.login(value).subscribe(() => { }, () => { })
  }

  onSubmitRegister(value: any) {
    console.log(value)
    this.authService.register(value).subscribe(() => { }, () => { })
  }

}
