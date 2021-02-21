'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const layouts = require('express-ejs-layouts');
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// レイアウトモジュールの使用をアプリケーションに設定
router.use(layouts);
router.use(express.static('public'));

router.use(
  express.urlencoded({
    extended: false,
  })
);
router.use(express.json());

// Homeページへ飛ぶ
router.get('/', homeController.goToHome);

// クイズプレイ中のページへ飛ぶ
router.get('/playing', homeController.goToPlaying);

// エラー処理
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

//- mount the router on the app
app.use('/', router);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});
