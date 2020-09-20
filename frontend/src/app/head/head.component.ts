import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
})
export class HeadComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() id: string = '';
  isLogin: boolean = false;
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.id.currentValue) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }
}
