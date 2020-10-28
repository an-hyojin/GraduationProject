import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { stringify } from 'querystring';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { SongInfo } from 'src/models/song-info';
import { map, startWith } from 'rxjs/operators';

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
  
  resultList = [];
  singerCtrl = new FormControl();
  constructor(
    private fb: FormBuilder,
    private http: Http,
    private router: Router
  ) {
    this.joinForm = fb.group({
      id: this.id,
      password: this.password,
      email: this.email,
      singer: this.singerCtrl
    });
  }
  filteredSingers: Observable<string[]>;
  visible = true;
  selectable = true;
  removable = true;
  songInfo = new FormControl();
  singers = [];
  searchList = [];
  
  @ViewChild('singerInput') singerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('chipList') chipList;

  onSubmit() {
    if(this.resultList.length==0){
      this.chipList.errorState = true;
    }
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
    this.getSong().subscribe((v) => {
      let res = JSON.parse(v._body);
      res.forEach((element) => {
        this.singers.push(new SongInfo(element));
      });
      this.singers.forEach((element) =>{
        if(!this.searchList.includes(element.singer)){
          this.searchList.push(element.singer);
        }
      });
      console.log(this.searchList);
      this.filteredSingers = this.singerCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }
  getSong(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/songs`);
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
  getSingerErrorMessage() {
    if (this.singerCtrl.hasError('required')) {
      return 'You must select at one value';
    }
  }

  remove(singer: string): void {
    const index = this.resultList.indexOf(singer);

    if (index >= 0) {
      this.resultList.splice(index, 1);
    }
    if(this.resultList.length==0){
      this.chipList.errorState = true;
    }else{
      this.chipList.errorState = false;
    }
    this.filteredSingers = this.singerCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
   if(!this.resultList.includes(event.option.viewValue)){
     if(this.resultList.length>4){
       this.chipList.errorState = true;
     }else{
      this.resultList.push(event.option.viewValue);
      this.singerCtrl.setValue(this.resultList);
      this.chipList.errorState = false;
     }
   }
  }

  private _filter(value: string): string[] {
    console.log(value);
    return this.searchList.filter(option => option.includes(value));
  }
 
}
