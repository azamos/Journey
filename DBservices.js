const mongodb = require('mongodb');
const { MongoClient } = mongodb;
const {MONGO_URL,DB_NAME} = require('./constants');

function DB() { };

const _connect = monURL => new MongoClient(monURL).connect();
const _close = monClient => monClient.close();

DB.prototype.write = async (collectionName, data, dataType, additionalIndexes = null, mainDB = DB_NAME, altMongoUrl = MONGO_URL) => {
    const monClient = await _connect(altMongoUrl);
    const collection = monClient.db(mainDB).collection(collectionName);
    if (additionalIndexes) {
        for (const index of additionalIndexes.keyPatterns) {
            collection.createIndex(index,
                additionalIndexes.options)
        }
    }
    const response = await collection.insertMany(
        data instanceof Array ?
            data : [data]);
    _close(monClient);
    return response.ops;
}


DB.prototype.find = async (collectionName, query, jump = 0, limiter = jump + 20, mainDB = DB_NAME, altMongoUrl = MONGO_URL) => {
    const monClient = await _connect(altMongoUrl)
    const queryResult = await monClient.db(mainDB).collection(collectionName)
        .find(query).skip(jump).limit(limiter).toArray();
    _close(monClient);
    return queryResult;
}

DB.singleInstance = new DB();
//DB.prototype.getSingleInstance = () => singleInstance;
Object.freeze(DB);//to prevent changing DB.singleInstance
const DBservice = DB.singleInstance;

module.exports = DBservice;