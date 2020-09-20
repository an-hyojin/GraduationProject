import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { SongInfo } from 'src/models/song-info';
import { Song } from 'src/models/song';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements OnInit {
  constructor(private http: Http, private router: Router) {}
  private apiBaseUrl = environment.apiBaseUrl;
  songInfos: SongInfo[] = [];

  ngOnInit(): void {
    this.getSong().subscribe((v) => {
      let res = JSON.parse(v._body);
      res.forEach((element) => {
        this.songInfos.push(new SongInfo(element));
      });
    });
  }
  getSong(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/songs`);
  }
  goSong(id) {
    console.log(id);
    this.router.navigate(['/song', id]);
  }
}
