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

app.get('/store', (req, res) => {
    //Fetch data from public database and store in the private database
    databaseHandler.connectMongoClient(() => {
        databaseHandler.tumblr.fetchTumblrData(req.query.tag,req.query.days, () => {
            res.send('success');
        });
    })
})

app.get('/searchFromPrivateData', (req, res) => {
    //Fetch data from private database
    databaseHandler.connectMongoClient(() => {
        databaseHandler.tumblr.searchTumblrData((data) => {
            res.send(data);
        });
    })
})

app.get('/clearData', (req, res) => {
    databaseHandler.connectMongoClient(() => {
        databaseHandler.tumblr.clearTumblrData(() => {
            res.send('success')
        })
    })
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