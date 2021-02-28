'use strict';

//- jsdomを使用してDOMをサーバーから取得可能にする
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let domObj;

//- playing.ejsのDOMを取得
const fetchDom = (async () => {
  const dom = await JSDOM.fromFile('views/playing.ejs');

  const document = dom.window.document;

  const loading = document.getElementById('loading'); //ロード中の文言
  const container = document.getElementById('container'); //大問、ジャンル、難易度を含む範囲
  const title = document.getElementById('title'); //大問全体
  const titleNum = document.getElementById('title__num'); //大問の数字部分
  const genreDetail = document.getElementById('genre__detail'); //ジャンル詳細
  const difficultyDetail = document.getElementById('difficulty__detail'); //難易度詳細
  const quizContent = document.getElementById('quiz__content'); //クイズの設問内容
  const choices = Array.from(document.getElementsByClassName('choice'));

  //- playing.ejsの上記DOMをオブジェクトで一元管理
  const domObj = {
    loading,
    container,
    title,
    titleNum,
    genreDetail,
    difficultyDetail,
    quizContent,
    choices,
  };

  return domObj;
})();

// //- globalでdomObjを使用できるようにする
(async () => {
  domObj = await fetchDom;
})();

const formattedQuiz = require('../models/quiz');
let quizContents; //!APIの内容を模範解答のような形式に変更したものを収納
let currentQuestion; //!現在解いている問題を表示
let quizNum = 1; //!現在の問題数を表示 1から始まる
let currentQuiz = 0; //!何番目の問題かを管理
let duplicatedQuestions = [];
let score = 0;

module.exports = {
  //- indexView res.json()
  goToHome: (req, res) => {
    res.render('home');
  },

  //¥ quiz.jsにてasyncでreturnを返しているため
  //¥ awaitをつけないと値を受け取ることができない
  goToPlaying: (req, res) => {
    res.render('playing');
  },

  ProceedQuiz: async (req, res, next) => {
    quizContents = await formattedQuiz.fetchQuiz();
    // console.log(quizContents);
    res.locals.quizNum = quizNum;
    console.log('■req', req.body.choice0);
    console.log('■req', req.body.choice1);
    console.log('■req', req.body.choice3);
    console.log('■req', req.body.choice2);

    console.log(domObj.genreDetail.textContent);
    res.locals.category = quizContents[currentQuiz].category;

    res.locals.difficulty = quizContents[currentQuiz].difficulty;
    res.locals.question = quizContents[currentQuiz].question;

    console.log('⭐', domObj.quizContent.innerHTML);
    console.log('⭐', quizContents[0].question);
    console.log('⭐確認中', domObj.quizContent.textContent);

    //- クイズの設問内容をejsで表示
    //* innerHTMLでエスケープ文字を有効にしている
    domObj.quizContent.innerHTML = quizContents[0].question;
    res.locals.quizContent = domObj.quizContent.innerHTML;

    //- form.action
    domObj.choices.forEach((choice, index) => {
      res.locals[`choice${index}`] = quizContents[0][`choice${index}`];
    });

    currentQuiz++;
    quizNum++;
    //- 最後の問題まで解答したら設問のカウントを0に戻す
    if (currentQuiz === 10) {
      currentQuiz = 0;
      quizNum = 0;
    }

    next();
  },
};
