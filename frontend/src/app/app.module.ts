import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRouterModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowSongComponent } from './show-song/show-song.component';
import { SongListComponent } from './song-list/song-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { SongSearchComponent } from './song-search/song-search.component';
import { JoinComponent } from './join/join.component';
import { HeadComponent } from './head/head.component';
import { SongQuizComponent } from './song-quiz/song-quiz.component';
import { HttpModule } from '@angular/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    ShowSongComponent,
    SongListComponent,
    MainComponent,
    LoginComponent,
    UserInfoComponent,
    SongSearchComponent,
    JoinComponent,
    HeadComponent,
    SongQuizComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    AppRouterModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    HttpModule,
    NgbModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
