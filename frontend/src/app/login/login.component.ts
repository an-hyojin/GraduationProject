import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupName, FormBuilder } from '@angular/forms';
import {MatFormFieldControl} from '@angular/material/form-field';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
  
})
export class LoginComponent implements OnInit {
  idControl = new FormControl('');
  passwordControl = new FormControl('');
  loginForm:FormGroup;
  hide = true;
  constructor(fb:FormBuilder) {
    this.loginForm =fb.group({
      id:this.idControl,
      password:this.passwordControl
    });
   }

  ngOnInit(): void {
  }

}
