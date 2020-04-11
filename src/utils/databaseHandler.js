const request = require('request');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const { MongoClient , ObjectID } = require('mongodb');
const {CONSTANTS} = require('../Constants');
const {DATABASE} = CONSTANTS;
let clientPersistent;

const connectMongoClient = (callback) => {
    MongoClient.connect(DATABASE.url(), { useNewUrlParser: true , useUnifiedTopology: true}, (error, client) => {
        if (error) {
            clientPersistent = undefined;
            return console.log('No connection made.')
        }
        console.log('Connection made.')
        clientPersistent = client
        callback()
    })
}

const fetchTumblrData = (tag, numberOfDays = 7, callback) => {
    var date = new Date();
    let callbackCount = 0;
    for(let count = 0; count < numberOfDays; count++) {
        console.log('count: '+ count + ' ', Math.floor(date/1000));
        var newDate = (new Date()).setDate(date.getDate())
        console.log(newDate)
        fetchTumblrDataForaTimeStamp(tag, newDate, () => {
            //Callback after receiving all responses
            callbackCount++;
            if(callbackCount == numberOfDays) {
                clientPersistent.close();
                callback()
            }
        })

        date.setDate(date.getDate() - 1)
    }
}

const fetchTumblrDataForaTimeStamp = ({tag, before, after}, callback) => {
    const url = 'https://api.tumblr.com/v2/tagged?api_key=sCRb3P9GE60ZqQJseEPyo6AYDOcZaWo6Ba9u6xXjLgk8qiiGua&tag=' + encodeURIComponent(tag) + '&before=' + before
    //'https://api.twitter.com/1.1/trends/available.json'
    console.log('URL: '+ url)
    https.request(url,{method: 'POST', headers: {'cache': 'no-cache'}}, (res) => {
        var body = '';
        
        res.on('data', chunk => {
            body += chunk.toString();
        })

        res.on('end',()=> {
            
            body = JSON.parse(body);
            // console.log(('\n\n\n\n' + before + '.txt\n', body.response.map((to) => {
            //     return to.summary
            // })))
          var count = 0;

          //Filter information
            var result = body.response.map((traversalObject) => {
              count++;
              //Extract info here
              return {
                ...traversalObject.image_permalink && {imageUrl: traversalObject.image_permalink},
                ...traversalObject.link_url && {link: traversalObject.link_url},
                timestamp: Math.floor(before/1000),
                short_url: traversalObject.short_url,
                summary: traversalObject.summary
              }
              
            }).filter((filterObject) => {
              return filterObject.summary.length != 0;
            })
            // console.log(result)

            //Initiate storing result in db
              addDataToTumblrCollection(result, callback);

            // console.log(result)
        })
    }).end()
}

const addDataToTumblrCollection = (entries, callback) => {
    // console.log("\n\n", entries)
    if(clientPersistent != undefined) {
        let numberOfEntriesAcknowledged = 0;
        const db = clientPersistent.db(DATABASE.DATABASENAME())
        //checkCallback() is used when insert operation is done
        const checkCallback = () => {
            numberOfEntriesAcknowledged++;
            if(entries.length == numberOfEntriesAcknowledged) {
                callback();
            }
        }
        db.collection('Tumblr').insertMany(entries).then((value) => {
            // console.log('fulfilled')
            // console.log(value)
            callback()
        }).catch((reason => {
            console.log('rejected')
            console.log(reason)
            callback();
        }))
    } else {
        console.log('Client is undefined')
    }
}

const searchTumblrData = (callback) => {
    if(clientPersistent != undefined) {
        let numberOfEntriesAcknowledged = 0;
        const db = clientPersistent.db(DATABASE.DATABASENAME());
        let data = db.collection('Tumblr').find();
        data.toArray().then((response) => {
            callback(response)
            clientPersistent.close();
        })
    }
}

const clearTumblrData = (callback) => {
    if(clientPersistent != undefined) {
        const db = clientPersistent.db(DATABASE.DATABASENAME());
        let data = db.collection('Tumblr').deleteMany().then((response) => {
            callback();
        });
    }
}

const log = {
    ip(address, callback) {
        if (clientPersistent != undefined) {
            const db = clientPersistent.db(DATABASE.DATABASENAME());
            let data = db.collection('ip').insertOne({
                ip: address,
                date: (new Date()).toString()
            }).then((response) => {
                callback();
            });
        }
    }
}

exports.connectMongoClient = connectMongoClient
exports.log = log;
exports.tumblr = {
    addDataToTumblrCollection,
    fetchTumblrData,
    fetchTumblrDataForaTimeStamp,
    searchTumblrData,
    clearTumblrData
}