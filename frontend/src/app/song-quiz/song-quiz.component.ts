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
  ) { }

  userName: String;
  sentence: String[] = [];
  questionList: String[] = [];
  answerList: String[][] = [];
  questionTrans: String[] = [];
  arrayQuizzes: String[][] = [];

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
  test: String;
  ngOnInit(): void {
    this.songId = this.route.snapshot.paramMap.get('songId');
    this.getSong().subscribe((v) => {
      this.song = Song.parseFrom(JSON.parse(v._body)[0]);
      for (var i = 0; i < 2; i++) {
        var index = Math.floor(Math.random() * 23);
        this.sentence = this.song.sentences.splice(index, 1);
        this.questionList = this.sentence[0].split(' ');
        this.answerList.push(this.sentence[0].split(' '));
        this.questionList.sort(() => Math.random() - 23);
        this.questionTrans.push(this.song.translation[index]);
        console.log(this.song.translation[index]);
        this.arrayQuizzes.push(this.questionList);
      }
    });
    console.log(this.questionTrans);
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
  drop(event: CdkDragDrop<string[]>, index) {
    moveItemInArray(this.arrayQuizzes[index], event.previousIndex, event.currentIndex);
  }
  checkAnswer(index): void {
    console.log()
    if (JSON.stringify(this.answerList[index]) === JSON.stringify(this.arrayQuizzes[index])) {
      alert('correct!!');
    } else {
      alert('Oops!');
    }
  }
}
