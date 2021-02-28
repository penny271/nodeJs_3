'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const layouts = require('express-ejs-layouts');
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// レイアウトモジュールの使用をアプリケーションに設定
router.use(express.static('public'));
router.use(layouts);

router.use(
  express.urlencoded({
    extended: false,
  })
);
//¥
router.use(bodyParser.json());
router.use(express.json());

// Homeページへ飛ぶ
router.get('/', homeController.goToHome);

//- ローカル変数にクイズデータを代入後、
// クイズプレイ中のページへ飛びクイズデータを表示
router.get(
  '/playing/exm',
  homeController.ProceedQuiz,
  homeController.goToPlaying
);
router.get('/playing', homeController.ProceedQuiz, homeController.goToPlaying);
router.get(
  '/playing/:currentQuiz',
  homeController.ProceedQuiz,
  homeController.goToPlaying
);

//¥POST
router.post(
  '/playing/countup',
  homeController.ProceedQuiz,
  homeController.goToPlaying
);
//¥実験
// router.get('/playing/:currentQuiz', homeController.ProceedQuiz, homeController.goToPlaying);

// エラー処理
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

//- mount the router on the app
app.use('/', router);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});
