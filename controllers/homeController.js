'use strict';

module.exports = {
  goToHome: (req, res) => {
    res.render('home');
  },

  goToPlaying: (req, res) => {
    console.log('playing');
    res.render('playing');
  },
};
