import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { ShowSongComponent } from './show-song/show-song.component';
import { QuizComponent } from './quiz/quiz.component';

const AppRoutes: Routes = [
  { path: '', redirectTo: 'song-list', pathMatch: 'full' },
  { path: 'song-list', component: SongListComponent },
  { path: 'song/:title', component: ShowSongComponent },
  { path: 'quiz/:title', component: QuizComponent}
];

export const AppRouterModule = RouterModule.forRoot(AppRoutes, {
  useHash: false,
});
