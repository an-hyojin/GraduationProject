import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: Http) {}

  ngOnInit(): void {}
  title = 'frontend';
}
