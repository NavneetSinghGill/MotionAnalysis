const express = require('express');
const path = require('path')
const translate = require('translate');
const googleTrends = require('google-trends-api');
const databaseHandler = require('./utils/databaseHandler');
const {CONSTANTS} = require('./Constants');

if(process.argv[2] == 'production') {
    CONSTANTS.ISLOCALENVIRONMENT = false
} else {
    CONSTANTS.ISLOCALENVIRONMENT = true
}

const app = express();

const parentDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(parentDirectoryPath))

app.get('', (req, res) => {
    console.log(__dirname);
    res.sendFile('./views/mainPage/', { root: __dirname });
})

app.get('/search', (req, res) => {
    //Fetch tumblr data and store in the given database
    databaseHandler.tumblr.fetchTumblrData(req.query.tag,7)
})

let port = 3000
app.listen(port, () => {
    console.log('Server is up and running on '+port)
})

//Google trends module test
// googleTrends.interestOverTime({keyword: 'Women\'s march'})
// .then(function(results){
//   console.log('Results', JSON.stringify(results));
// })
// .catch(function(err){
//   console.error('Oh no there was an error', err);
// });