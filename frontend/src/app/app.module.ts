import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainFeedComponent } from './main-feed/main-feed.component';
import { PostComponent } from './main-feed/post/post.component';
import { CrearPostComponent } from './main-feed/crear-post/crear-post.component';

@NgModule({
  declarations: [
    AppComponent,
    MainFeedComponent,
    PostComponent,
    CrearPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
