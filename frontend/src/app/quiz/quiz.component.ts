import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Song } from 'src/models/song';
import { ActivatedRoute, Router } from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
  song: Song;
  constructor(
    private http: Http, 
    private route: ActivatedRoute,
    private router: Router) {}
  title: String;
  userName: String;
  sentence: String[];
  questionList: String[];
  answerList: String[];
  questionTrans: String;
  
  getSong(): Observable<any> {
    // 노래 정보 가져오기
    let body = { title: this.title };
    let headers = new Headers({
      'Cache-Control': 'no-cache',
    });
    let options = new RequestOptions({
      headers: headers,
    });
    return this.http.post(`${this.apiBaseUrl}/songs`, body, options);
  }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title');
    var index = Math.floor( Math.random() * (20 - 1 ) );
    this.getSong().subscribe((v) => {
      this.song = Song.parseFrom(JSON.parse(v._body)[0]);
      this.sentence = this.song.sentences.splice(index,1);
      this.questionList = this.sentence[0].split(" ");
      for(var i=0; i<this.questionList.length; i++){
        this.answerList[i] = this.questionList[i];
      }
      this.shuffle(this.questionList);
      this.questionTrans = this.song.translation[index];
    });
    this.userName = "USER1";
  }
  shuffle(array): void{
    array.sort(() => Math.random() - 0.5);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questionList, event.previousIndex, event.currentIndex);
  }
  checkAnswer(): void{
    if(this.answerList == this.questionList){
      alert("correct!!");
    }else{
      alert("Oops!");
    }
  }
}