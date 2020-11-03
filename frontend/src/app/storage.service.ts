import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private keys = {
    token: 'token',
    username: 'username'
  }

  constructor() { }

  saveToken(token: string) {
    localStorage.setItem(this.keys.token, token);
  }

  getToken() {
    return localStorage.getItem(this.keys.token);
  }

  deleteToken() {
    localStorage.removeItem(this.keys.token);
  }

  saveUsername(username: string) {
    localStorage.setItem(this.keys.username, username);
  }

  getUsername() {
    return localStorage.getItem(this.keys.username);
  }

  deleteUsername() {
    localStorage.removeItem(this.keys.username);
  }

}
