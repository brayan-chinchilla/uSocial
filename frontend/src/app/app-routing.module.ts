import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CovidGraphGuard } from './covid-graph.guard';
import { CovidGraphComponent } from './covid-graph/covid-graph.component';
import { MainFeedComponent } from './main-feed/main-feed.component';
import { MainFeeedGuard } from './main-feeed.guard';
import { ProfileGuard } from './profile.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ProfileGuard]
  },
  {
    path: 'feed',
    component: MainFeedComponent,
    canActivate: [MainFeeedGuard]
  },
  {
    path: 'covid19',
    component: CovidGraphComponent,
    canActivate: [CovidGraphGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
