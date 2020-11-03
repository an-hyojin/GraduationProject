import { Quiz } from 'src/models/quiz';
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
  pos_list: [[string]];
  morphs: [[string]];
  morphs_trans: [[string]];
  album: string;
  a_quiz_info: [Quiz];
  b_quiz_info: [Quiz];
  c_quiz_info: [Quiz];
  static parseFrom(json): Song {
    const o: Song = new Song();
    o.id = json._id;
   
    o.title = json.title;
    o.singer = json.singer;
    o.album = json.album;
    o.sentences = json.sentences;
    o.translation = json.translation;
    o.count_list = json.count_list;
    o.pos_list = json.pos_list;
    o.morphs = json.morphs;
    o.a_list = json.a_list;
    o.b_list = json.b_list;
    o.c_list = json.c_list;
    o.a_quiz_info = json.a_quiz_info;
    o.b_quiz_info = json.b_quiz_info;
    o.c_quiz_info = json.c_quiz_info;
    o.morphs_trans = json.morphs_trans;
    
    return o;
  }
}
