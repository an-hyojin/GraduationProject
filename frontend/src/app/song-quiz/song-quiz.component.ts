import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { from, Observable } from 'rxjs';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Song } from 'src/models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from 'src/models/quiz';
import { WordQuiz } from 'src/models/word-quiz'
import { SentenceQuiz} from 'src/models/sentence-quiz';
import { element } from 'protractor';

@Component({
  selector: 'app-song-quiz',
  templateUrl: './song-quiz.component.html',
  styleUrls: ['./song-quiz.component.scss'],
})
export class SongQuizComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  solve: boolean = false;
  userName: String;
  sentence: String[] = [];
  sentensQuizMorphs: String[] = [];
  questionList: String[][] = [];
  id: string;

  questionTrans: String[] = [];
  answerList: String[][] = [];

  arrayQuizzes: SentenceQuiz[] = [];
  correctList: String[][] = [];
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
    return this.http.get(`${this.apiBaseUrl}/api/quizzes/` + this.songId, options);
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
  quizzes: WordQuiz[] = [];
  examples: string[][] = [];
  answer: string[] = [];
  test: String;
  ngOnInit(): void {
    this.songId = this.route.snapshot.paramMap.get('songId');
    this.id = localStorage.getItem('id');
    
    this.getQuiz().subscribe(async (v) => {
      let temp = JSON.parse(v._body);
      this.singer = temp.singer;
      this.title = temp.title;
        const quiz = new Quiz(temp);
        this.quizzes = quiz.word_quiz;
        quiz.word_quiz.forEach(element => {
          let answers = [];
          answers.push(element.answer);
          element.example.forEach((v) => answers.push(v));
          answers.sort(() => Math.random() - Math.random());
          this.answer.push('');
          this.examples.push(answers);
        });
        this.arrayQuizzes = quiz.sentence_quiz;
        this.arrayQuizzes.forEach(element => {
          let sentenceAnswer: String[] = [];
          this.sentensQuizMorphs = element.morphs;
          this.sentensQuizMorphs.forEach((v) => sentenceAnswer.push(v));
          this.answerList.push(sentenceAnswer);
          this.sentensQuizMorphs.sort(() => Math.random() - Math.random());
          this.questionList.push(this.sentensQuizMorphs);
        })
    });
  }

  select(num: number, ans: string) {
    this.answer[num] = ans;
  }

  drop(event: CdkDragDrop<string[]>,num) {
    moveItemInArray(
      this.questionList[num],
      event.previousIndex,
      event.currentIndex
    );
  }
  checkAnswer(): void {
    let a = 0;
    let b = 0;
    let c = 0;
    this.solve = true;
    for (let i = 0; i < this.quizzes.length; i++) {
      if (!this.answer[i]) {
        alert('You have to solve Problem' + (i + 1));
        this.solve = false;
        return;
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
    }
    console.log(a, b, c);
    if (this.solve) {
      let count = 0;
      this.correctList = [];
      for (let i = 0; i < this.answerList.length; i++) {
        if (
          JSON.stringify(this.answerList[i]) !==
          JSON.stringify(this.questionList[i])
        ) {
          count++;
        }else{
          this.correctList.push(this.questionList[i]);
        }
      }

      let body = {
        songId: this.songId,
        userId: this.id,
        a: a,
        b: b,
        c: c,
        count: count,
      };
      let headers = new Headers({
        'Cache-Control': 'no-cache',
      });
      let options = new RequestOptions({
        headers: headers,
      });
      this.http.post(`${this.apiBaseUrl}/api/quizzes/`, body, options);
    }
    console.log(this.solve);
  }
}
