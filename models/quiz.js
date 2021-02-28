'use strict';

const fetch = require('node-fetch');
//-Quizモデル
const URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
let quizContents = [];
let formattedQuizzes = []; //-整形後クイズデータ
let quizNum = 0;

//- Quizクラスを作成し、整形したQuizオブジェクトを生成
class Quiz {
  constructor(quizData) {
    this.rawQuizContents = quizData;
    this.formattedQuizContents = [];
  }

  //- アプリケーションで使えるようにAPIから
  //- 取得したデータを整形する
  formatQuiz() {
    quizContents = this.rawQuizContents.results.map(loadedQuestion => {
      //-▼オブジェクト作成 最終的に
      //- mapで配列の要素として配列に入る
      const formattedQuestion = {
        question: loadedQuestion.question,
        category: loadedQuestion.category,
        difficulty: loadedQuestion.difficulty,
      };

      //¥ スプレッド演算子使用
      const multipleChoices = [...loadedQuestion.incorrect_answers];

      //正解の解答を配列に入れ、splice()で挿入したランダムな番号を正解とする
      formattedQuestion.answer = Math.floor(Math.random() * 4);
      multipleChoices.splice(
        formattedQuestion.answer, //-例: 2
        0,
        loadedQuestion.correct_answer //-例: "correct_answer": "Central Processing Unit",
      );

      //formattedQuestionに問題を全て入れ、それぞれに
      //プロパティと値を設定して各問題にアクセスできるようにする
      multipleChoices.forEach((choice, index) => {
        formattedQuestion['choice' + index] = choice;
      });

      return formattedQuestion;
    }); //-map終わり
  }
}

module.exports = {
  //- 整形後のquiz10問を保持した配列を取得
  fetchQuiz: async () => {
    const result = await fetch(URL);
    const quizData = await result.json();
    const formattedQuiz = new Quiz(quizData);
    formattedQuiz.formatQuiz();

    // console.log('⭐', quizContents); //!配列
    return quizContents;
  },
};
