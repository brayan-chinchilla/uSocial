import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrearPostService {

  apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private storage: StorageService) { }

  newPost(image:string, text:string){
    var user_id = this.storage.getUsername();
    return this.http.post(`${this.apiUrl}/posts`, {image, text, user_id});
  }
}
