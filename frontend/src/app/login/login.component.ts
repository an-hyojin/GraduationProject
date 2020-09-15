import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupName,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { environment } from 'src/environments/environment';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
    this.loginForm = fb.group({
      id: this.id,
      password: this.password,
    });
  }
  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.http
        .post(`${this.apiBaseUrl}/api/login`, this.loginForm.value)
        .subscribe((v) => {
          let id = v['_body'];
          console.log(id);
          if (!!id) {
            localStorage.setItem('auth', id);
            this.router.navigate(['/main']);
          } else {
            alert('Login Failed');
          }
        });
    }
  }
  ngOnInit(): void {
    if (!!localStorage.getItem('auth')) {
      this.router.navigate(['/main']);
    }
  }
  getIdErrorMessage() {
    if (this.id.hasError('required')) {
      return 'You must enter a value';
    }
    console.log(this.email.errors);
    return this.id.hasError('minlength')
      ? 'Please enter at least 6 characters.'
      : '';
  }
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }

    return this.password.hasError('minlength')
      ? 'Please enter at least 6 characters.'
      : '';
  }
}
