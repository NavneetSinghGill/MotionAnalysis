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

const fetchTumblrDataForaTimeStamp = (tag, date, callback) => {
    const url = 'https://api.tumblr.com/v2/tagged?api_key=sCRb3P9GE60ZqQJseEPyo6AYDOcZaWo6Ba9u6xXjLgk8qiiGua&tag=' + encodeURIComponent(tag) + '&before?=' + Math.floor(date/1000)
    //'https://api.twitter.com/1.1/trends/available.json'

    https.request(url, (res) => {
        let data;
        res.on('data', (d) => {
            data = data + d;
        })
        res.on('end',(d)=> {
            console.log(JSON.parse(data.toString()))
        })
    }).end()

    // axios.post(url).then(({data}) => {
    //         console.log(('\n\n\n\n' + date + '.txt\n', data.response.map((to) => {
    //             return to.summary
    //         })))
    //       let count = 0;

    //       //Filter information
    //         let result = data.response.map((traversalObject) => {
    //           count++;
    //           //Extract info here
    //           return {
    //             ...traversalObject.image_permalink && {imageUrl: traversalObject.image_permalink},
    //             ...traversalObject.link_url && {link: traversalObject.link_url},
    //             timestamp: Math.floor(date/1000),
    //             short_url: traversalObject.short_url,
    //             summary: traversalObject.summary
    //           }
              
    //         }).filter((filterObject) => {
    //           return filterObject.summary.length != 0;
    //         })
    //         // console.log(result)

    //         //Initiate storing result in db
    //           addDataToTumblrCollection(result, callback);

    //         // console.log(result)
    //         // fs.writeFileSync('BigdataTestApiResult.txt',result)
    // }).catch(error => {
    //     console.log(error)
    //     callback(undefined, error);
    // })
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

        entries.map((entry) => {
            db.collection('Tumblr').insertOne(entry,{
            }).then((value) => {
                // console.log('fulfilled')
                // console.log(value)
                checkCallback();
            }).catch((reason => {
                console.log('rejected')
                console.log(reason)
                checkCallback();
            }))
        })
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

exports.connectMongoClient = connectMongoClient
exports.tumblr = {
    addDataToTumblrCollection,
    fetchTumblrData,
    searchTumblrData,
    clearTumblrData
}