import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Song } from 'src/models/song';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-song',
  templateUrl: './show-song.component.html',
  styleUrls: ['./show-song.component.scss'],
})
export class ShowSongComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
  song: Song;
  constructor(private http: Http, private route: ActivatedRoute) {}
  title: String;
  getSong(): Observable<any> {
    // 노래 정보 가져오기
    let body = { title: this.title };
    let headers = new Headers({
      'Cache-Control': 'no-cache',
    });
    let options = new RequestOptions({
      headers: headers,
    });
    return this.http.post(`${this.apiBaseUrl}/api/songs`, body, options);
  }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title');
    this.getSong().subscribe((v) => {
      this.song = Song.parseFrom(JSON.parse(v._body)[0]);
    });
  }
}
