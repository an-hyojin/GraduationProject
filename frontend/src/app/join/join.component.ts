import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  joinForm:FormGroup;
  hide = true;
  private apiBaseUrl = environment.apiBaseUrl;
  email = new FormControl('',[Validators.required, Validators.email])

  constructor(private fb:FormBuilder,private http:Http) {
    this.joinForm =fb.group({
      id:new FormControl(''),
      email:this.email,
      password:new FormControl('')
    });
   }
   onSubmit(){
     console.log(this.joinForm);
     if(this.joinForm.valid){
      this.http.post(`${this.apiBaseUrl}/join`, this.joinForm.value).subscribe(v=>{
        console.log(v['_body']);
       
      });
  
     }
   }
  ngOnInit(): void {
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
