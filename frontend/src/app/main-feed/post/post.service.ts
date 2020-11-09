import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getOwnerInfo(username: string){
    return this.http.get(`${this.apiUrl}/users/${username}`);
  }

  translateText(text: string){
    return this.http.post(`${this.apiUrl}/posts/translate`, {text});
  }
}
