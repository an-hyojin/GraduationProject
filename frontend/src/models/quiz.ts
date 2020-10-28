import { SentenceQuiz } from './sentence-quiz';
import { WordQuiz } from './word-quiz';

export class Quiz {
  sentence_quiz:SentenceQuiz[] =[]
  word_quiz:WordQuiz[] = [];
  constructor(json: any) {
    json.sentence_quiz.forEach(element => {
      this.sentence_quiz.push(new SentenceQuiz(element));
    });
    json.word_quiz.forEach(element => {
      this.word_quiz.push(new WordQuiz(element));
    });
  }
}
