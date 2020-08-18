export class SongInfo {
  title: String;
  singer: String;
  id: String;
  static parseFrom(json): SongInfo {
    const o: SongInfo = new SongInfo();
    o.title = json.title;
    o.singer = json.singer;
    o.id = json.id;
    return o;
  }
}
