export class SongInfo {
  title: String;
  singer: String;
  id: String;
  album: String;
  constructor(json: any) {
    this.title = json.title;
    this.singer = json.singer;
    this.id = json._id;
    this.album = json.album;
  }
}
