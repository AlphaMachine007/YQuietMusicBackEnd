const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'YQuiet';
const client = new MongoClient(url,{ useUnifiedTopology:true });
client.connect(function(err){
    if(err){
        console.log('连接失败'+err);
        return;
    }
    console.log('连接成功')
    const db = client.db(dbName)
})