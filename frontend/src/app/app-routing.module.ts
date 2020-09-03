import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { ShowSongComponent } from './show-song/show-song.component';
import { MainComponent } from './main/main.component';
import { JoinComponent } from './join/join.component';

const AppRoutes: Routes = [
  { path: '', redirectTo:'main', pathMatch: 'full'},
  { path: 'main', component: MainComponent},
  { path: 'song/:title', component: ShowSongComponent },
  {path:'join', component:JoinComponent},
  { path: '*', redirectTo:'main', pathMatch: 'full'}
];

export const AppRouterModule = RouterModule.forRoot(AppRoutes, {
  useHash: false,
});
