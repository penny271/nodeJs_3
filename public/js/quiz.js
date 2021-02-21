'use strict';

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
let quizContents = [];
//!現在解いている問題を表示
let currentQuestion;
//!何番目の問題かを管理
let questionIndex = 0;
let duplicatedQuestions = [];
let score = 0;
//- Open Trivia DBのAPIのurl
const URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

//- Quizクラスを作成し、整形したQuizオブジェクトを生成
class Quiz {
  constructor(quizData) {
    this.rawQuizContents = quizData;
    this.formattedQuizContents = [];
  }

  //- アプリケーションで使えるようにAPIから
  //- 取得したデータを整形する
  formatQuiz() {
    console.log(this.rawQuizContents);
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

//- 正しいアロー関数の書き方
const getQuiz = async () => {
  //- クイズデータをfetchで取得
  const res = await fetch(URL);
  const quizData = await res.json();
  return quizData;
};

//home.ejsのクイズ開始ボタンがあるページでは
//loadingやanswerといった要素がまだ存在せず、
//エラーが発生するのでそれを防ぐためif文を設定
if (!start) {
  getQuiz()
    .then(quizData => {
      const formattedQuiz = new Quiz(quizData);
      formattedQuiz.formatQuiz();
      loading.classList.add('hidden');
      container.classList.remove('hidden');
      answers.classList.remove('hidden');
      console.log('⭐整形後', quizContents);
      startGame();
    })
    .catch(err => {
      console.error('Failed to load API');
      console.error(err);
    });
}

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

//ゲームを開始する
const startGame = () => {
  duplicatedQuestions = [...quizContents];
  if (questionIndex === duplicatedQuestions.length) {
    hideElements();
    return;
  }

  showContent();
};

//選択肢をクリックした際の正誤判定を行う
//正解なら青、不正解なら赤色を付ける
choices.forEach(choice => {
  choice.addEventListener('click', e => {
    const selectedChoice = e.target;
    let classToApply = 'incorrect';

    classToApply =
      currentQuestion.answer === parseInt(selectedChoice.dataset['number'])
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
      //!classをremoveしないと次の問題でも
      //!classが付いたままとなり
      //!ボタンに正解または不正解時の色がついたままと
      //!なるのでremoveでクラスを除去する
      selectedChoice.classList.remove(classToApply);
      questionIndex++;
      startGame();
    }, 300);
  });
});
