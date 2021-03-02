'use strict';

//! バックエンド側で整形したクイズ10問を
//! playing.ejsのvalue経由で取得しようとしたところ、
//! 配列を文字列でとってくるため利用不可だった
const quizContents = document.getElementById('quizContents');

const start = document.getElementById('start'); //home.ejsのクイズ開始ボタンを取得
const loading = document.getElementById('loading'); //ロード中の文言

const container = document.getElementById('container'); //大問、ジャンル、難易度を含む範囲
const title = document.getElementById('title'); //大問全体
const titleNum = document.getElementById('title__num'); //大問の数字部分
const genreDetail = document.getElementById('genre__detail'); //ジャンル詳細
const difficultyDetail = document.getElementById('difficulty__detail'); //難易度詳細
//クイズの設問内容
const quizContent = document.getElementById('quiz__content');
//複数の問題の選択肢
const choices = Array.from(document.getElementsByClassName('choice'));
const answers = document.getElementById('answers'); //ul要素
const homeBtn = document.getElementById('homeBtn');
const startBtn = document.getElementById('startBtn');
//!APIの内容をformatを終えた形式に
//!変更したものを収納していく
// let quizContents = [];
//!現在解いている問題を表示
let currentQuestion;
//!何番目の問題かを管理
let questionIndex = 0;
let duplicatedQuestions = [];
let score = 0;

// hiddenAnswer取得
const hiddenAnswer = document.getElementById('hiddenAnswer'); //隠し要素のクイズの正解番号

//選択肢をクリックした際の正誤判定を行う
//正解なら青、不正解なら赤色を付ける
choices.forEach(choice => {
  choice.addEventListener('click', e => {
    const selectedChoice = e.target;
    let classToApply = 'incorrect';

    console.log(hiddenAnswer.value);

    classToApply =
      hiddenAnswer.value === selectedChoice.dataset['number']
        ? 'correct'
        : 'incorrect';

    if (classToApply === 'correct') {
      selectedChoice.classList.add(classToApply);
      score++;
    } else {
      selectedChoice.classList.add(classToApply);
    }
    //正解、不正解の色付けがされ、次の問題に移る時間を調整
    setTimeout(() => {
      //!classをremoveしないと次の問題でもclassが付いたままとなり
      //!ボタンに正解または不正解時の色がついたままとなるなるので
      //!removeでクラスを除去する
      selectedChoice.classList.remove(classToApply);
      questionIndex++;
    }, 300);
  });
});
