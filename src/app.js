const translate = require('translate');
const googleTrends = require('google-trends-api');
const databaseHandler = require('./utils/databaseHandler');

//Prints the trends from the google trends directly
databaseHandler.tumblr.fetchTumblrData('coronavirus',7)

//Google trends module test
// googleTrends.interestOverTime({keyword: 'Women\'s march'})
// .then(function(results){
//   console.log('Results', JSON.stringify(results));
// })
// .catch(function(err){
//   console.error('Oh no there was an error', err);
// });