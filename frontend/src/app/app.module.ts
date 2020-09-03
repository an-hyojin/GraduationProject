import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRouterModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { ShowSongComponent } from './show-song/show-song.component';
import { SongListComponent } from './song-list/song-list.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SongSearchComponent } from './song-search/song-search.component';
import { JoinComponent } from './join/join.component';
@NgModule({
  declarations: [AppComponent, ShowSongComponent, SongListComponent, MainComponent, LoginComponent, UserInfoComponent, SongSearchComponent, JoinComponent],
  imports: [BrowserModule,ReactiveFormsModule,FormsModule, MatInputModule,AppRouterModule,MatButtonModule,MatIconModule ,HttpModule,NgbModule, BrowserAnimationsModule,MatFormFieldModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
