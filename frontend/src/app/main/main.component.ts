import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor() {}
  isLogin: boolean = false;
  ngOnInit(): void {
    console.log(!localStorage.getItem('auth'));
    if (!!localStorage.getItem('auth')) {
      this.isLogin = true;
    }
  }
  logout() {
    localStorage.removeItem('auth');
    this.isLogin = false;
  }
}
