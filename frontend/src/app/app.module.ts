import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainFeedComponent } from './main-feed/main-feed.component';
import { PostComponent } from './main-feed/post/post.component';
import { CrearPostComponent } from './main-feed/crear-post/crear-post.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { NgChatModule } from 'ng-chat';
import { ChartsModule } from 'ng2-charts';
import { CovidGraphComponent } from "./covid-graph/covid-graph.component";

@NgModule({
  declarations: [
    AppComponent,
    MainFeedComponent,
    PostComponent,
    CrearPostComponent,
    ProfileComponent,
    NavbarComponent,
    CovidGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChatModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
