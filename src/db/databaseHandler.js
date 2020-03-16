const request = require('request');
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

            connectMongoClient(() => {
              addDataToTumblr(result)
            })
            // console.log(result)
            fs.writeFileSync('BigdataTestApiResult.txt',result)
        } else {
            console.log(error)
        }
    })
}

const addDataToTumblr = (entries) => {
    if(clientPersistent != undefined) {
        const db = clientPersistent.db(DATABASE.DATABASENAME())

        entries.map((entry) => {
            db.collection('Tumblr').insertOne(entry,{
            }).then((value) => {
                console.log('fulfilled')
                // console.log(value)
            }).catch((reason => {
                console.log('rejected')
                console.log(reason)
            }))
        })
    } else {
        console.log('Client was undefined')
    }
}

exports.connectMongoClient = connectMongoClient
exports.tumblr = {
    addDataToTumblr,
    fetchTumblrData
}