import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { stringify } from 'querystring';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit {
  joinForm: FormGroup;
  hide = true;
  private apiBaseUrl = environment.apiBaseUrl;
  email = new FormControl('', [Validators.required, Validators.email]);
  id = new FormControl('', [Validators.required, Validators.minLength(6)]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  constructor(
    private fb: FormBuilder,
    private http: Http,
    private router: Router
  ) {
    this.joinForm = fb.group({
      id: this.id,
      password: this.password,
      email: this.email,
    });
  }
  onSubmit() {
    console.log(this.joinForm);
    if (this.joinForm.valid) {
      let formData = new FormData();
      formData.append('id', this.joinForm.value.id);
      formData.append('password', this.joinForm.value.password);
      formData.append('email', this.joinForm.value.email);
      this.http
        .post(`${this.apiBaseUrl}/api/users/join`, formData)
        .subscribe((v) => {
          let result = v['_body'] == 'true';
          if (result) {
            alert('Success to Join');
            this.router.navigate(['/login']);
          } else {
            alert('Failed to sign up for membership!');
          }
        });
    }
  }
  ngOnInit(): void {
    if (!!localStorage.getItem('auth')) {
      this.router.navigate(['/main']);
    }
  }
  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getIdErrorMessage() {
    if (this.id.hasError('required')) {
      return 'You must enter a value';
    }

    return this.id.hasError('minlength')
      ? 'Please enter at least 6 characters.'
      : '';
  }
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }
    console.log(this.password);
    return this.password.hasError('minlength')
      ? 'Please enter at least 6 characters.'
      : '';
  }
}
