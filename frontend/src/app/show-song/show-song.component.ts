import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Song } from 'src/models/song';
import { ActivatedRoute, Router } from '@angular/router';
import request from 'request';

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
  ) { }
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
  dictionary(morph: string, trans: string, pos: string) {
    // 클릭하는 부분 - morph:형태소, trans: 번역본, pos:원형
    // morph가 들리게
    console.log(morph, trans, pos);
    this.dict = new DictDiv(morph, trans, pos);

    let kakao_speech_url = 'https://kakaoi-newtone-openapi.kakao.com/v1/synthesize';
    let rest_api_key = environment.apiKey;

    let headers = new Headers({
      "Content-Type": "application/xml",
      "Authorization": "kakaoAK " + rest_api_key, // check필요
    });

    let options = new RequestOptions({
      headers: headers,
    });
    // request를 이런 형식으로 요청하는게 맞나 체크 
    return this.http.post(`${kakao_speech_url}`, morph, options);
  }
}

export class DictDiv implements OnInit {
  morph: string;
  trans: string;
  root: string;
  constructor(morph: string, trans: string, root: string) {
    this.morph = morph;
    this.trans = trans;
    this.root = root;
  } // morph : 형태소, trans : 번역본, root : 원형

  ngOnInit() {

  }
}

