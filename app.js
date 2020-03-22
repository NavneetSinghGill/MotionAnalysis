var express = require('express');
var path = require('path');
var translate = require('translate');
var googleTrends = require('google-trends-api');
var databaseHandler = require('./utils/databaseHandler');

var _require = require('./Constants'),
    CONSTANTS = _require.CONSTANTS;

if (process.argv[2] == 'production') {
    CONSTANTS.ISLOCALENVIRONMENT = false;
} else {
    CONSTANTS.ISLOCALENVIRONMENT = true;
}

var app = express();
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});
var parentDirectoryPath = path.join(__dirname, '../src/views');
app.use(express.static(parentDirectoryPath));

app.get('', function (req, res) {
    console.log(__dirname);
    res.sendFile('./views/mainPage/', { root: __dirname });
});
app.set('etag', false);

app.get('/store', function (req, res) {
    //Fetch data from public database and store in the private database
    databaseHandler.connectMongoClient(function () {
        databaseHandler.tumblr.fetchTumblrDataForaTimeStamp(req.query, function () {
            res.send('success');
        });
        // databaseHandler.tumblr.fetchTumblrData(req.query.tag,req.query.days, () => {
        //     res.send('success');
        // });
    });
});

app.get('/searchFromPrivateData', function (req, res) {
    //Fetch data from private database
    databaseHandler.connectMongoClient(function () {
        databaseHandler.tumblr.searchTumblrData(function (data) {
            res.send(data);
        });
    });
});

app.get('/clearData', function (req, res) {
    databaseHandler.connectMongoClient(function () {
        databaseHandler.tumblr.clearTumblrData(function () {
            res.send('success');
        });
    });
});

var port = 3000;
app.listen(port, function () {
    console.log('Server is up and running on ' + port);
});

//Google trends module test
// googleTrends.interestOverTime({keyword: 'Women\'s march'})
// .then(function(results){
//   console.log('Results', JSON.stringify(results));
// })
// .catch(function(err){
//   console.error('Oh no there was an error', err);
// });