const request = require('request')
const fs = require('fs')
const translate = require('translate');
const googleTrends = require('google-trends-api');
const databaseHandler = require('./db/databaseHandler');

const fetchTumblrData = (tag, callback) => {
    const url = 'https://api.tumblr.com/v2/tagged?api_key=sCRb3P9GE60ZqQJseEPyo6AYDOcZaWo6Ba9u6xXjLgk8qiiGua&tag=' + tag
    //'https://api.twitter.com/1.1/trends/available.json'

    request({url, json: true}, (error, {body}) => {
        if (!error) {
          let count = 0;

            let result = body.response.map((traversalObject) => {
              count++;
              //Extract info here
              
              return {
                timestamp: Date.now(),
                short_url: traversalObject.short_url,
                summary: traversalObject.summary
              }
              
            }).filter((filterObject) => {
              return filterObject.summary.length != 0
            })

            databaseHandler.connectMongoClient(() => {
              databaseHandler.addDataToTumblr(result)
            })
            // console.log(result)
            fs.writeFileSync('BigdataTestApiResult.txt',result)
        } else {
            console.log(error)
        }
    })
}
//Prints the trends from the google trends directly
fetchTumblrData('coronavirus')

//Google trends module test
// googleTrends.interestOverTime({keyword: 'Women\'s march'})
// .then(function(results){
//   console.log('Results', JSON.stringify(results));
// })
// .catch(function(err){
//   console.error('Oh no there was an error', err);
// });