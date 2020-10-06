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
  solve: boolean = false;
  userName: String;
  sentence: String[] = [];
  questionList: String[] = [];
  id: string;
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
    this.id = localStorage.getItem('id');
    this.getSong().subscribe((v) => {
      this.song = Song.parseFrom(JSON.parse(v._body));
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
    this.getQuiz().subscribe(async (v) => {
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
        //this.solve = true;
        this.examples.push(answers);
      });
    });
  }

  select(num: number, ans: string) {
    this.answer[num] = ans;
  }

  drop(event: CdkDragDrop<string[]>, index) {
    moveItemInArray(
      this.arrayQuizzes[index],
      event.previousIndex,
      event.currentIndex
    );
    console.log(this.arrayQuizzes[index]);
  }
  checkAnswer(): void {
    let a = 0;
    let b = 0;
    let c = 0;
    for (let i = 0; i < this.quizzes.length; i++) {
      if (!this.answer[i]) {
        alert('You have to solve Problem' + (i + 1));
        break;
      }
      if (this.answer[i] != this.quizzes[i].answer) {
        switch (this.quizzes[i].level) {
          case 'A':
            a++;
            break;
          case 'B':
            b++;
            break;
          case 'C':
            c++;
            break;
        }
      } 
      console.log(this.answer[i]);
      console.log(this.quizzes[i].answer);
    }
    console.log(a, b, c);
    this.solve = true;
    console.log(this.solve);
  }
}
