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
  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  songId: String;
  getSong(): Observable<any> {
    // 노래 정보 가져오기
    let body = { songId: this.songId };
>>>>>>> 1121395fc060c2b980e68872bc2bdc3e15eb8edc
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

    console.log(this.songId);
    this.getSong().subscribe((v) => {
      this.song = Song.parseFrom(JSON.parse(v._body)[0]);
    });
    this.userName = "USER1";
  }
<<<<<<< HEAD
  goQuiz(title: String) {
    this.router.navigate(['/quiz', title]);
  }
}
=======
  goQuiz(id: String) {
    this.router.navigate(['/quiz', id]);
  }
}
>>>>>>> 1121395fc060c2b980e68872bc2bdc3e15eb8edc
