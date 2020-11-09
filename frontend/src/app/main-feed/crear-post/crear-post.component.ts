import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ResponseAPI } from 'src/app/response-api.interface';
import { CrearPostService } from './crear-post.service';

import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.css']
})
export class CrearPostComponent implements OnInit {

  @Output() newPostEvent = new EventEmitter<object>();

  image: any;
  text:string;

  errorMessage: string;

  constructor(private crearPostService: CrearPostService) { }

  ngOnInit(): void {
  }
 
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.errorMessage = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.image = reader.result; 
    }
  }

  newPost(){
    this.crearPostService.newPost(this.image, this.text).pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      this.newPostEvent.emit(response.data);
      this.image = this.text = "";
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

}
