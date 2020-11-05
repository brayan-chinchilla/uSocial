import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseAPI } from 'src/app/response-api.interface';
import { AuthService } from '../auth.service';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from 'src/app/storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showRegister: boolean = false;
  errorMessage: string = '';
  backTo: string | undefined = undefined;

  loginForm: FormGroup = this.fb.group({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  registerForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    photo: new FormControl(''),
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private storage: StorageService, private router: Router, private activeRoute: ActivatedRoute) {
    this.backTo = this.activeRoute.snapshot.queryParams['backTo'];
  }

  goToRegister() {
    this.errorMessage = '';
    this.registerForm.reset();
    this.showRegister = true;
  }

  goToLogin() {
    this.errorMessage = '';
    this.loginForm.reset();
    this.showRegister = false;
  }

  onSubmitLogin(value: any) {
    this.errorMessage = '';
    this.authService.login(value).pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      this.storage.saveToken(response.data.token);
      this.storage.saveUsername(response.data.user._id);
      this.router.navigate([this.backTo || '/profile']);
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

  onSubmitRegister(value: any) {
    this.errorMessage = '';
    this.authService.register(value).pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      this.storage.saveToken(response.data.token);
      this.storage.saveUsername(response.data.user._id);
      this.router.navigate(['/profile']);
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

}
