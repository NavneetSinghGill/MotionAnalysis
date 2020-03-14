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

const addDataToTumblr = (entries) => {
    if(clientPersistent != undefined) {
        const db = clientPersistent.db(DATABASE.DATABASENAME())

        entries.map((entry) => {
            db.collection('Tumblr').insertOne(entry,{
            }).then((value) => {
                // console.log('fulfilled')
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

exports.addDataToTumblr = addDataToTumblr
exports.connectMongoClient = connectMongoClient