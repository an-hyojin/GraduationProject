import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupName, FormBuilder } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { Http } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
  
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  hide = true;
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private fb:FormBuilder,private http:Http) {
    this.loginForm =fb.group({
      id:new FormControl(''),
      password:new FormControl('')
    });
   }
  onSubmit(){
    console.log(this.loginForm.value);
    this.http.post(`${this.apiBaseUrl}/login`, this.loginForm.value).subscribe(v=>{
      console.log(v['_body']);
     
    });
  }
  ngOnInit(): void {

  }

}
