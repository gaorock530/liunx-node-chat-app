// const moment = require('moment');
//var date = moment();
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  }
};

module.exports = {generateMessage};
