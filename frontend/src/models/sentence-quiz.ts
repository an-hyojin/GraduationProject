export class SentenceQuiz {
    morphs: string[];
    trans: string;
    constructor(json: any) {
      this.morphs = json.morphs;
      this.trans = json.trans;
    }
  }
  