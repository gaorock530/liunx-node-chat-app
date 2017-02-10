// const moment = require('moment');
//var date = moment();
var generateMessage = (from = '', text, color = '') => {
  return {
    from,
    text,
    color,
    createdAt: new Date().getTime()
  }
};

module.exports = {generateMessage};
