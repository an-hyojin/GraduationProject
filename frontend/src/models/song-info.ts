export class SongInfo {
  title: String;
  singer: String;
  id: String;
  constructor(json: any) {
    this.title = json.title;
    this.singer = json.singer;
    this.id = json._id;
  }
}
