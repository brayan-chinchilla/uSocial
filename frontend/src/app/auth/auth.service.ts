import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private storage: StorageService) { }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/users/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/users/register`, data);
  }

  isLogged() {
    const token = this.storage.getToken();
    return !!token;
  }

  logout() {
    this.storage.deleteToken();
    this.storage.deleteUsername();
  }

  getLoggedUserId() {
    return this.storage.getUsername();
  }
}
