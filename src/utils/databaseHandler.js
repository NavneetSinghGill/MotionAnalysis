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

const fetchTumblrData = (tag, numberOfDays) => {
    var date = new Date();
    for(let count = 0; count < numberOfDays; count++) {
        console.log('count: '+ count + ' ', Math.floor(date/1000));
        var newDate = (new Date()).setDate(date.getDate())
        fetchTumblrDataForaTimeStamp(tag, newDate)
        date.setDate(date.getDate() - 1)
    }
}

const fetchTumblrDataForaTimeStamp = (tag, date) => {
    const url = 'https://api.tumblr.com/v2/tagged?api_key=sCRb3P9GE60ZqQJseEPyo6AYDOcZaWo6Ba9u6xXjLgk8qiiGua&tag=' + encodeURIComponent(tag) + '&before?=' + Math.floor(date/1000)
    //'https://api.twitter.com/1.1/trends/available.json'
    console.log(url)
    request({url, json: true}, (error, {body}) => {
        if (!error) {
          let count = 0;

            let result = body.response.map((traversalObject) => {
              count++;
              //Extract info here
              console.log('return ' + Math.floor(date/1000) + ' ' + date/1000)
              return {
                imageUrl: traversalObject.image_permalink,
                link: traversalObject.link_url,
                timestamp: Math.floor(date/1000),
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
            // fs.writeFileSync('BigdataTestApiResult.txt',result)
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