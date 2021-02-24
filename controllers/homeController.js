'use strict';

const fetch = require('node-fetch');
//-Quizモデル
const QuizModel = require('../models/quiz');
const URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
let quizContents = [];
let formattedQuizzes = []; //-整形後クイズデータ

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

//- ▼を使うと正常にawaitさせることができた！
const getQuiz = async () => {
  const allSortedQuizzes = await QuizModel.find({})
    .sort({ createdAt: -1 })
    .limit(10);
  formattedQuizzes = allSortedQuizzes;
};

module.exports = {
  fetchQuiz: async (req, res, next) => {
    const result = await fetch(URL);
    const quizData = await result.json();

    const formattedQuiz = new Quiz(quizData);
    formattedQuiz.formatQuiz();

    quizContents.forEach((quizContent, index) => {
      QuizModel.create(quizContent)
        .then(async () => {
          if (quizContents.length <= index + 1) {
            //- Promise が返ってくるまで awaitで 処理停止
            await getQuiz();
            res.locals.formattedQuizzes = formattedQuizzes;
            next();
          }
        })
        .catch(error => {
          next(error);
        });
    });
  },

  //- indexView res.json()
  goToHome: (req, res) => {
    res.render('home');
  },

  goToPlaying: (req, res) => {
    res.render('playing');
  },
};
