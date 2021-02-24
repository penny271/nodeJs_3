'use strict';

const httpStatus = require('http-status-codes');

module.exports = {
  pageNotFoundError: (req, res, next) => {
    res.render('error');
  },

  internalServerError: (error, req, res, next) => {
    console.log('⭐⭐ error', error);
    res.send(
      `${httpStatus.INTERNAL_SERVER_ERROR} | Sorry, our application is experiencing a problem!`
    );
  },
};
