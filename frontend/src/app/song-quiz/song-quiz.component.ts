import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

  userName: String;
  sentence: String[] = [];
  questionList: String[] = [];
  answerList: String[] = [];
  questionTrans: String;

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
  quizzes: Quiz[] = [];
  examples: string[][] = [];
  answer: string[] = [];
  ngOnInit(): void {
    this.songId = this.route.snapshot.paramMap.get('songId');

    var index = Math.floor(Math.random() * (20 - 1));
    this.getSong().subscribe((v) => {
      this.song = Song.parseFrom(JSON.parse(v._body)[0]);
      this.sentence = this.song.sentences.splice(index, 1);
      this.questionList = this.sentence[0].split(' ');
      for (var i = 0; i < this.questionList.length; i++) {
        this.answerList[i] = this.questionList[i];
      }
      this.shuffle(this.questionList);
      this.questionTrans = this.song.translation[index];
    });
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

  shuffle(array): void {
    array.sort(() => Math.random() - 0.5);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questionList, event.previousIndex, event.currentIndex);
  }
  checkAnswer(): void {
    if (this.answerList == this.questionList) {
      alert('correct!!');
    } else {
      alert('Oops!');
    }
  }
}
