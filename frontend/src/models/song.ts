export class Song {
  title: string;
  id: string;
  singer: string;
  sentences: [string];
  translation: [string];
  a_list: [[number]];
  b_list: [[number]];
  c_list: [[number]];
  count_list: [[number]];
  morphs: [[string]];
  album: string;
  static parseFrom(json): Song {
    const o: Song = new Song();
    o.id = json._id;
    o.title = json.title;

    o.singer = json.singer;
    o.album = json.album;
    o.sentences = json.sentences;
    o.translation = json.translation;
    o.count_list = json.count_list;
    o.morphs = json.morphs;
    o.a_list = json.a_list;
    o.b_list = json.b_list;
    o.c_list = json.c_list;
    return o;
  }
}
