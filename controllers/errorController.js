'use strict';

const httpStatus = require('http-status-codes');

module.exports = {
  pageNotFoundError: (req, res, next) => {
    // return;
    res.render('error');
  },

  internalServerError: (error, req, res, next) => {
    res.send(
      `${httpStatus.INTERNAL_SERVER_ERROR} | Sorry, our application is experiencing a problem!`
    );
  },
};
