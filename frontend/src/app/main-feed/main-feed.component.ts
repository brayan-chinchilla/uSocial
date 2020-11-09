import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ResponseAPI } from '../response-api.interface';
import { MainFeedService } from './main-feed.service';

@Component({
  selector: 'app-main-feed',
  templateUrl: './main-feed.component.html',
  styleUrls: ['./main-feed.component.css']
})
export class MainFeedComponent implements OnInit {

  postsCurrent: Array<any>;
  errorMessage: string = "";
  rawFilterField: string = "";

  constructor(private mainFeedService: MainFeedService) { }

  getTags(): Array<string>{
    if(this.rawFilterField == ""){
      return [];
    }
    return this.rawFilterField.split("; ")
  }

  ngOnInit(): void {
    this.filter();
  }

  filter() {
    var tags = this.getTags();
    console.log(tags);
    this.mainFeedService.getPosts(tags).pipe(
      filter((response: ResponseAPI) => response.ok && response.statuscode === 200)
    ).subscribe((response) => {
      console.log(response.data)
      this.postsCurrent = response.data;
    }, ({ error }: HttpErrorResponse) => { this.errorMessage = error.message; })
  }

  newPost(post){
    this.postsCurrent.unshift(post);
  }

}
