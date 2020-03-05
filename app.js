const request = require('request')
const fs = require('fs')
const googleTrends = require('google-trends-api');

const trends = (tag, callback) => {
    const url = 'https://api.tumblr.com/v2/tagged?api_key=sCRb3P9GE60ZqQJseEPyo6AYDOcZaWo6Ba9u6xXjLgk8qiiGua&tag=' + tag
    //'https://api.twitter.com/1.1/trends/available.json'

    request({url, json: true}, (error, {body}) => {
        if (!error) {
          let count = 0;
            let result = body.response.map((ser) => {
              count++;
              return count + '. ' + ser.summary
            })
            console.log(result)
            fs.writeFileSync('BigdataTestApiResult.txt',result)
        } else {
            console.log(error)
        }
    })
}
//Prints the trends from the google trends directly
trends('coronavirus')

//Google trends module test
// googleTrends.interestOverTime({keyword: 'Women\'s march'})
// .then(function(results){
//   console.log('Results', JSON.stringify(results));
// })
// .catch(function(err){
//   console.error('Oh no there was an error', err);
// });