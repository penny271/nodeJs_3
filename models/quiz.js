'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuizSchema = new Schema(
  {
    answer: {
      type: Number,
      required: true,
    },
    //- 各ユーザーの名前 (必須)
    category: {
      type: String,
      required: true,
    },
    //- ⭐ユーザーID (必須)
    difficulty: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    // choices: [],
    choice0: {
      type:String,
    },
    choice1: {
      type:String,
    },
    choice2: {
      type:String,
    },
    choice3: {
      type:String,
    },

    //- 各メッセージでタイムスタンプを保存
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizModel', QuizSchema);
