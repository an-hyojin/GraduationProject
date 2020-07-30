import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private apiBaseUrl = environment.apiBaseUrl;
  private headers = new Headers({'Content-Type':'application/json'});
  
  constructor(private http:Http){
    this.nlp().subscribe(v=>{
      console.log(v);
    })
   }

  nlp():Observable<any> { // angular - node js - django 연결 샘플
    return this.http.get(`${this.apiBaseUrl}/songs`);
  }

  ngOnInit(): void {
  
  }
  title = 'frontend';
}
