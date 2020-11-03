import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private http: Http) {}
  private apiBaseUrl = environment.apiBaseUrl;

  user: User;
  id: string;
  ngOnInit(): void {
    if (!!localStorage.getItem('auth')) {
      this.getUser(localStorage.getItem('auth')).subscribe((v) => {
        this.user = new User(JSON.parse(v._body));
        this.id = this.user.id;
        localStorage.setItem('id', this.user.id);
      });
    }
  }
  logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('id');
    this.id = '';
    this.user = null;
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
