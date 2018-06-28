// Retrieve
var MongoClient = require('mongodb').MongoClient;

function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
      if(!err) {
        return reject(err);
      }

      resolve(db);
    });
  });
}


async function main() {
  try {
    const db = await connect();
    console.log(db);
  } catch(error) {
    console.log(error);
  }
}

main();