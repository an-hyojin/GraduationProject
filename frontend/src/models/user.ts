import { SongInfo } from './song-info';

export class User {
  id: string;
  _id: string;
  email: string;
  learning: SongInfo[];
  constructor(json: any) {
   
    this.id = json.id;
    this._id = json._id;
    this.email = json.email;
    this.learning = [];
    json.learning.forEach((element) => {
      this.learning.push(new SongInfo(JSON.parse(element)));
    });
  }
}
