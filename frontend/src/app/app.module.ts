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

@NgModule({
  declarations: [AppComponent, ShowSongComponent, SongListComponent, MainComponent, LoginComponent, UserInfoComponent],
  imports: [BrowserModule, AppRouterModule, HttpModule,NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
