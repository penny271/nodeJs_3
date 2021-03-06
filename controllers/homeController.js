'use strict';

// quiz.jsをロードする
const formattedQuiz = require('../models/quiz');

module.exports = {
  goToHome: (req, res) => {
    res.render('home');
  },

  // 整形したクイズ10問を取得する
  proceedQuiz: async (req, res) => {
    const quizContents = await formattedQuiz.fetchQuiz();
    return res.json(quizContents);
  },
};
