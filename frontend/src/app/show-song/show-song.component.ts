import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Song } from 'src/models/song';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-song',
  templateUrl: './show-song.component.html',
  styleUrls: ['./show-song.component.scss'],
})
export class ShowSongComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
  song: Song;
  userName: String;
  songslice = [];
  dict: DictDiv;
  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  songId: String;
  id: String;
  getSong(): Observable<any> {
    // 노래 정보 가져오기
    let body = { songId: this.songId };
    let headers = new Headers({
      'Cache-Control': 'no-cache',
    });
    let options = new RequestOptions({
      headers: headers,
    });
    return this.http.post(`${this.apiBaseUrl}/api/songs`, body, options);
  }

  ngOnInit(): void {
    this.songId = this.route.snapshot.paramMap.get('songId');
    this.id = localStorage.getItem('id');
    console.log(this.songId);
    this.getSong().subscribe((v) => {
      this.song = Song.parseFrom(JSON.parse(v._body));
      for (let i = 0; i < this.song.sentences.length / 5; i++) {
        let shows = [];
        for (let j = 0; j < 5 && i * 5 + j < this.song.sentences.length; j++) {
          shows.push(this.song.sentences[i * 5 + j]);
        }
        this.songslice.push(shows);
      }
    });
    this.userName = 'USER1';
  }
  goQuiz() {
    this.router.navigate(['/quiz', this.songId]);
  }
  dictionary(morph: string, trans: string) {
    this.dict = new DictDiv(morph, trans);
  }
}
class DictDiv {
  morph: string;
  trans: string;
  constructor(morph: string, trans: string) {
    this.morph = morph;
    this.trans = trans;
  }
}
