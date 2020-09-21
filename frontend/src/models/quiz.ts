export class Quiz {
  answer: string;
  count_list: [Number];
  example: [string];
  level: string;
  morphs: [string];
  morph_index: Number;
  title: string;
  singer: string;
  translation: string;
  constructor(json: any) {
    this.answer = json.answer;
    this.count_list = json.count_list;
    this.example = json.example;
    this.level = json.level;
    this.title = json.title;
    this.singer = json.singer;
    this.morphs = json.morphs;
    this.morph_index = json.morph_index;
    this.translation = json.translation;
  }
}
