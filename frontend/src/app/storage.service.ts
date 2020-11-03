import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private keys = {
    token: 'token'
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

}
