'use strict';

const homeContainer = document.getElementById('home-container'); //-ejsのゲーム開始のdiv要素を取得
const loadingContent = document.getElementById('loading-content'); //-ejsのゲーム中のdiv要素を取得

const start = document.getElementById('start'); //home.ejsのクイズ開始ボタンを取得
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
//!バックエンドからとってきたformatを終えたクイズのデータを保存
let quizContents = [];
//!現在解いている問題を表示
let currentQuestion;
//!何番目の問題かを管理
let questionIndex = 0;
//! quizContentsの複製を入れる
let duplicatedQuestions = [];
//!正答数を管理
let score = 0;

//- home画面からロード中の画面へ表示を書換えする
start.addEventListener('click', () => {
  homeContainer.classList.add('hidden');
  loadingContent.classList.remove('hidden');
});

//ゲームを開始する
const startGame = () => {
  duplicatedQuestions = [...quizContents];
  if (questionIndex === duplicatedQuestions.length) {
    hideElements();
    return;
  }

  showContent();
};

//ブラウザに問題文やジャンル、難易度を表示する
const showContent = () => {
  currentQuestion = duplicatedQuestions[questionIndex];

  titleNum.textContent = `${questionIndex + 1}`;
  genreDetail.textContent = ` ${currentQuestion.category}`;
  difficultyDetail.textContent = ` ${currentQuestion.difficulty}`;
  quizContent.innerHTML = ` ${currentQuestion.question}`;

  choices.forEach((choice, index) => {
    choices[index].textContent = currentQuestion['choice' + index]; //4択問題の内容
  });
};

//¥fetch()を使って自作APIを読み込む
start.addEventListener('click', async () => {
  const fetchedQuiz = await fetch('/playing/render');
  quizContents = await fetchedQuiz.json();
  container.classList.remove('hidden');
  loadingContent.classList.add('hidden');
  answers.classList.remove('hidden');
  startGame();
});

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    const selectedChoice = e.target;
    let classToApply = 'incorrect';
    currentQuestion.answer === parseInt(selectedChoice.dataset.number)
      ? (classToApply = 'correct')
      : (classToApply = 'incorrect');
    selectedChoice.classList.add(classToApply);
    if (classToApply === 'correct') score++;
    setTimeout(() => {
      questionIndex++;
      selectedChoice.classList.remove(classToApply);
      // 10問解き終わったらshowResult()を走らせる
      if (questionIndex === duplicatedQuestions.length) {
        showResult();
        return;
      }
      startGame();
    }, 200);
  });
});

const showResult = () => {
  hideElements();
};

//10問解き終わったあとに不要な要素を隠す
const hideElements = () => {
  const genre = document.getElementById('genre');
  const difficulty = document.getElementById('difficulty');
  genre.classList.add('hidden');
  difficulty.classList.add('hidden');

  title.textContent = `あなたの正答数は${score}です！！`;
  quizContent.textContent = '再度チャレンジしたい場合は以下をクリック!!';
  choices.forEach(choice => {
    choice.classList.add('hidden');
  });
  homeBtn.classList.remove('hidden');
};
