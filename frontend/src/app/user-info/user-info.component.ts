import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { User } from '../../models/user';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnChanges {
  constructor() {}

  @Input() user: User;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.user);
  }
}
