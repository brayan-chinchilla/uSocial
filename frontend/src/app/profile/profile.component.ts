import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ResponseAPI } from '../response-api.interface';
import { StorageService } from '../storage.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  errorMessage: string = '';
  profileForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    botmode: new FormControl(false, Validators.required),
    password: new FormControl('', Validators.required),
    photo: new FormControl(''),
  })

  constructor(private fb: FormBuilder, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getUserProfile().pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      const user = response.data.user;
      this.profileForm.controls['name'].setValue(user.name);
      this.profileForm.controls['username'].setValue(user.username);
      this.profileForm.controls['email'].setValue(user.email);
      this.profileForm.controls['botmode'].setValue(user.photo);
      this.profileForm.controls['photo'].setValue(user.photo);
    }, ({ error }: HttpErrorResponse) => { console.log(error); this.errorMessage = error.message; })
  }

  onUpdateProfile(value: any) {
    console.log(value)
    // this.errorMessage = '';
    // this.profileService.getUserProfile().pipe(
    //   filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    // ).subscribe((response) => {
    //   console.log(response)
    // }, ({ error }: HttpErrorResponse) => { console.log(error); this.errorMessage = error.message; })
  }

}
