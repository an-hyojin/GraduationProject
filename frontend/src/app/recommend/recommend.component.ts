import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Http, RequestOptions } from '@angular/http';

import { environment } from 'src/environments/environment';
import { SongInfo } from 'src/models/song-info';
import { element } from 'protractor';
import { User } from 'src/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
})
export class RecommendComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
  page = 1;
  pageSize = 4;
  constructor(private http: Http, private router: Router) {}
  id: string;
  songInfos: SongInfo[][];
  ngOnInit(): void {
    
    if (!!localStorage.getItem('id')) {
      this.id = localStorage.getItem('id');
    }
    if(!!localStorage.getItem('auth')){
      this.getUser(localStorage.getItem('auth')).subscribe((v) => {
        const user = new User(JSON.parse(v._body));
        this.getRecommendItem().subscribe((v) => {
          this.songInfos = [];
          let res = JSON.parse(v._body);
          for (let i = 0; i < res.length; i++) {
            if (i % this.pageSize == 0) {
              this.songInfos.push([]);
            }
            this.songInfos[Math.floor(i / 4)].push(new SongInfo(res[i]));
          }
         
        }, error=>{
          alert('실패했습니다. 다시 접속해주세요');
        });
      }, error => {
        this.router.navigate(['/main']);
      });
      
    }else{
      this.router.navigate(['/main']);
    }
    
  }

  getRecommendItem(): Observable<any> {
    // 노래 정보 가져오기
    let headers = new Headers({
      'Cache-Control': 'no-cache',
    });
    let options = new RequestOptions({
      headers: headers,
    });
    return this.http.get(
      `${this.apiBaseUrl}/api/songs/recommend/${localStorage.getItem('auth')}`,
      options
    );
  }
  getUser(_id: string): Observable<any> {
    // 노래 정보 가져오기
    let body = { id: _id };
    let headers = new Headers({
      'Cache-Control': 'no-cache',
    });
    let options = new RequestOptions({
      headers: headers,
    });
    return this.http.post(`${this.apiBaseUrl}/api/users/info`, body, options);
  }
}
