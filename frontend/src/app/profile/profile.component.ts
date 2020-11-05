import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ResponseAPI } from '../response-api.interface';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  errorMessage: string = '';
  successMessage: string = '';
  profileImage: string | ArrayBuffer = '';

  profileForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    botmode: new FormControl(false, Validators.required),
    password: new FormControl('', Validators.required),
    photo: new FormControl(null),
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
      this.profileForm.controls['botmode'].setValue(user.botmode);
      this.profileImage = user.photo;
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

  onUpdateProfile(value: any) {
    this.errorMessage = '';
    this.successMessage = '';
    this.profileService.updateUserProfile(value).pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      this.successMessage = response.message;
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

  handleUpload(event) {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profileForm.controls['photo'].setValue(reader.result);
        this.profileImage = reader.result;
      };
    }
  }

}
