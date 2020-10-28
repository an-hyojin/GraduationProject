import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SongInfo } from 'src/models/song-info';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { element } from 'protractor';

@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss']
})
export class SongSearchComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
  songInfo = new FormControl();
  songList = [];
  searchList = [];
  resultList = [];
  filteredOptions: Observable<string[]>;
  constructor(private http: Http, private router: Router) {}
  ngOnInit(): void {
    this.getSong().subscribe((v) => {
      let res = JSON.parse(v._body);
      res.forEach((element) => {
        this.songList.push(new SongInfo(element));
      });
      this.songList.forEach((element) =>{
        this.searchList.push(element.singer+" - "+element.title);
      });
    });
    this.filteredOptions = this.songInfo.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))    
      );
      
  }
  getSong(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/songs`);
  }
  searchWord: String;
  search(){
    if(this.resultList!=null){
      this.resultList = [];
    }
    var element = <HTMLInputElement>document.getElementById('search-form');
    this.searchWord = element.value;
    this.songList.forEach((element) =>{
      if(this.searchWord==element.title||this.searchWord==element.singer||this.searchWord==element.singer+" - "+element.title){
        this.resultList.push(element);
      }
    });

  }
  goSong(id) {
    console.log(id);
    this.router.navigate(['/song', id]);
  }
  private _filter(value: string): string[] {
    console.log(value);
    return this.searchList.filter(option => option.includes(value));
  }
}
