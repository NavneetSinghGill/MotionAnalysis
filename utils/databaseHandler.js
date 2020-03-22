var request = require('request');
var axios = require('axios');
var https = require('https');
var fs = require('fs');

var _require = require('mongodb'),
    MongoClient = _require.MongoClient,
    ObjectID = _require.ObjectID;

var _require2 = require('../Constants'),
    CONSTANTS = _require2.CONSTANTS;

var DATABASE = CONSTANTS.DATABASE;

var clientPersistent = void 0;

var connectMongoClient = function connectMongoClient(callback) {
    MongoClient.connect(DATABASE.url(), { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
        if (error) {
            clientPersistent = undefined;
            return console.log('No connection made.');
        }
        console.log('Connection made.');
        clientPersistent = client;
        callback();
    });
};

var fetchTumblrData = function fetchTumblrData(tag) {
    var numberOfDays = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
    var callback = arguments[2];

    var date = new Date();
    var callbackCount = 0;
    for (var count = 0; count < numberOfDays; count++) {
        console.log('count: ' + count + ' ', Math.floor(date / 1000));
        var newDate = new Date().setDate(date.getDate());
        console.log(newDate);
        fetchTumblrDataForaTimeStamp(tag, newDate, function () {
            //Callback after receiving all responses
            callbackCount++;
            if (callbackCount == numberOfDays) {
                clientPersistent.close();
                callback();
            }
        });

        date.setDate(date.getDate() - 1);
    }
};

var fetchTumblrDataForaTimeStamp = function fetchTumblrDataForaTimeStamp(_ref, callback) {
    var tag = _ref.tag,
        before = _ref.before,
        after = _ref.after;

    var url = 'https://api.tumblr.com/v2/tagged?api_key=sCRb3P9GE60ZqQJseEPyo6AYDOcZaWo6Ba9u6xXjLgk8qiiGua&tag=' + encodeURIComponent(tag) + '&before=' + before;
    //'https://api.twitter.com/1.1/trends/available.json'
    console.log('URL: ' + url);
    https.request(url, { method: 'POST', headers: { 'cache': 'no-cache' } }, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk.toString();
        });

        res.on('end', function () {

            body = JSON.parse(body);
            // console.log(('\n\n\n\n' + before + '.txt\n', body.response.map((to) => {
            //     return to.summary
            // })))
            var count = 0;

            //Filter information
            var result = body.response.map(function (traversalObject) {
                count++;
                //Extract info here
                return Object.assign({}, traversalObject.image_permalink && { imageUrl: traversalObject.image_permalink }, traversalObject.link_url && { link: traversalObject.link_url }, {
                    timestamp: Math.floor(before / 1000),
                    short_url: traversalObject.short_url,
                    summary: traversalObject.summary
                });
            }).filter(function (filterObject) {
                return filterObject.summary.length != 0;
            });
            // console.log(result)

            //Initiate storing result in db
            addDataToTumblrCollection(result, callback);

            // console.log(result)
        });
    }).end();
};

var addDataToTumblrCollection = function addDataToTumblrCollection(entries, callback) {
    // console.log("\n\n", entries)
    if (clientPersistent != undefined) {
        var numberOfEntriesAcknowledged = 0;
        var db = clientPersistent.db(DATABASE.DATABASENAME());
        //checkCallback() is used when insert operation is done
        var checkCallback = function checkCallback() {
            numberOfEntriesAcknowledged++;
            if (entries.length == numberOfEntriesAcknowledged) {
                callback();
            }
        };
        db.collection('Tumblr').insertMany(entries).then(function (value) {
            // console.log('fulfilled')
            // console.log(value)
            callback();
        }).catch(function (reason) {
            console.log('rejected');
            console.log(reason);
            callback();
        });
    } else {
        console.log('Client is undefined');
    }
};

var searchTumblrData = function searchTumblrData(callback) {
    if (clientPersistent != undefined) {
        var numberOfEntriesAcknowledged = 0;
        var db = clientPersistent.db(DATABASE.DATABASENAME());
        var data = db.collection('Tumblr').find();
        data.toArray().then(function (response) {
            callback(response);
            clientPersistent.close();
        });
    }
};

var clearTumblrData = function clearTumblrData(callback) {
    if (clientPersistent != undefined) {
        var db = clientPersistent.db(DATABASE.DATABASENAME());
        var data = db.collection('Tumblr').deleteMany().then(function (response) {
            callback();
        });
    }
};

exports.connectMongoClient = connectMongoClient;
exports.tumblr = {
    addDataToTumblrCollection: addDataToTumblrCollection,
    fetchTumblrData: fetchTumblrData,
    fetchTumblrDataForaTimeStamp: fetchTumblrDataForaTimeStamp,
    searchTumblrData: searchTumblrData,
    clearTumblrData: clearTumblrData
};