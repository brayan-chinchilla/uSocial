import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ResponseAPI } from 'src/app/response-api.interface';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post:any;
  owner:any = {
    name: "",
    photo: ""
  }
  errorMessage: any;
  translatedText: string;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getOwnerInfo(this.post.user_id).pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      this.owner = response.data.user;
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

  translateText() {
    this.postService.translateText(this.post.text).pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      this.translatedText = response.data.translatedText;
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

}
