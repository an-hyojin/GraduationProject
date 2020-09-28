import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SongInfo } from 'src/models/song-info';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss']
})
export class SongSearchComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;
  songInfo = new FormControl('');
  songList = [];
  constructor(private http: Http, private router: Router) {}
  ngOnInit(): void {
    this.getSong().subscribe((v) => {
      let res = JSON.parse(v._body);
      res.forEach((element) => {
        this.songList.push(new SongInfo(element));
      });
    });
  }
  getSong(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/songs`);
  }
  searchWord: String;
  search(){
    var element = <HTMLInputElement>document.getElementById('search-form');
    this.searchWord = element.value;
    console.log(this.searchWord);
  }
  goSong(id) {
    console.log(id);
    this.router.navigate(['/song', id]);
  }
}
