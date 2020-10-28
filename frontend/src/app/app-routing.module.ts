import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { ShowSongComponent } from './show-song/show-song.component';

import { MainComponent } from './main/main.component';
import { JoinComponent } from './join/join.component';
import { LoginComponent } from './login/login.component';
import { SongQuizComponent } from './song-quiz/song-quiz.component';
import { RecommendComponent } from './recommend/recommend.component';
const AppRoutes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'song/:songId', component: ShowSongComponent },
  { path: 'join', component: JoinComponent },
  { path: 'login', component: LoginComponent },
  { path: 'quiz/:songId', component: SongQuizComponent },
  { path: 'recommend', component: RecommendComponent },
  { path: '*', redirectTo: 'main', pathMatch: 'full' },
];

export const AppRouterModule = RouterModule.forRoot(AppRoutes, {
  useHash: false,
});
