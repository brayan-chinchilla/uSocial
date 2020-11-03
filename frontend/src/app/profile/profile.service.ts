import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private storage: StorageService,) { }

  getUserProfile() {
    const userid = this.storage.getUsername();
    if (userid)
      return this.http.get(`${this.apiUrl}/users/${userid}`);
  }

}
