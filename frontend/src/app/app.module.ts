import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouterModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { ShowSongComponent } from './show-song/show-song.component';
import { SongListComponent } from './song-list/song-list.component';

@NgModule({
  declarations: [AppComponent, ShowSongComponent, SongListComponent],
  imports: [BrowserModule, AppRouterModule, HttpModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
