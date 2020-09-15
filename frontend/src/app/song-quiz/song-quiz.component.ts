import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Song } from 'src/models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from 'src/models/quiz';
@Component({
  selector: 'app-song-quiz',
  templateUrl: './song-quiz.component.html',
  styleUrls: ['./song-quiz.component.scss'],
})
export class SongQuizComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
  song: Song;
  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  songId: String;
  title: string;
  singer: string;
  getQuiz(): Observable<any> {
    // 노래 정보 가져오기
    let body = { songId: this.songId };
    let headers = new Headers({
      'Cache-Control': 'no-cache',
    });
    let options = new RequestOptions({
      headers: headers,
    });
    return this.http.get(`${this.apiBaseUrl}/api/quiz/` + this.songId, options);
  }
  quizzes: Quiz[] = [];
  examples: string[][] = [];
  answer: string[] = [];
  ngOnInit(): void {
    this.songId = this.route.snapshot.paramMap.get('songId');
    this.getQuiz().subscribe((v) => {
      JSON.parse(v._body).forEach((element) => {
        const quiz = new Quiz(element);
        this.quizzes.push(quiz);
        this.title = quiz.title;
        this.singer = quiz.singer;
        let answers = [];
        answers.push(quiz.answer);
        quiz.example.forEach((v) => answers.push(v));
        answers.sort(() => Math.random() - Math.random());
        this.answer.push('');
        this.examples.push(answers);
        console.log(this.quizzes);
      });
    });
  }
  select(num: number, ans: string) {
    this.answer[num] = ans;
  }
}
