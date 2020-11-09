import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class MainFeedService {

  apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private storage: StorageService,) { }

  getPosts(labels: Array<string>){
    const username = this.storage.getUsername();
    return this.http.post(`${this.apiUrl}/posts/${username}`, labels.length == 0 ? {} : {labels})
  }
}