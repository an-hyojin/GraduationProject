import { Component } from '@angular/core';
import {Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private http: Http) {}

  ngOnInit(): void {

  }
  title = 'frontend';
  
}
