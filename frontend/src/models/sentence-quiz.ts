export class SentenceQuiz {
    morphs: string[];
    trans: string;
    sentence: string;
    constructor(json: any) {
      this.morphs = json.morphs;
      this.trans = json.trans;
      this.sentence = json.sentence;
    }
  }
  