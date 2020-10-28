export class WordQuiz {
  answer: string;
  count_list: [Number];
  example: [string];
  level: string;
  morphs: [string];
  morph_index: Number;
  translation: string;
  trans: string;
  constructor(json: any) {
    this.answer = json.answer;
    this.count_list = json.count_list;
    this.example = json.example;
    this.level = json.level;
    this.morphs = json.morphs;
    this.morph_index = json.morph_index;
    this.translation = json.translation;
    this.trans = json.trans;
  }
}
