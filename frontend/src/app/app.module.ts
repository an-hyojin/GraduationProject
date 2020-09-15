import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouterModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { ShowSongComponent } from './show-song/show-song.component';
import { SongListComponent } from './song-list/song-list.component';
import { QuizComponent } from './quiz/quiz.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [AppComponent, ShowSongComponent, SongListComponent, QuizComponent],
  imports: [BrowserModule, AppRouterModule, HttpModule, NgbModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
