var express = require("express");
var cors = require("cors");

var http = require("http");
var app = express();
const port = process.env.PORT || 3000;

// Add Middleware
app.use(express.json())

// CORS allows you to configure the web API's security. 
// It has to do with allowing other domains to make requests against your web API.
app.use(cors());

const { MongoClient } = require('mongodb')
const username = 'favourfelix'
const password = 'emmanuel'
const dbName = 'afterschool'

let db = null

async function main () {
  const client = new MongoClient(`mongodb+srv://${username}:${password}@cluster0.5g703.mongodb.net/${dbName}?retryWrites=true&w=majority`)
  try {
    await client.connect()
    db = client.db(dbName)
    console.log('connected')
  }
  catch(err) {
    console.error('ERR', err)
  }
}

main().catch(console.error)

app.get('/lessons', async (req, res, next) => {
  await db.collection('lesson').find().toArray((e, results) => {
    if (e) return next(e)
    res.json(results)
  })
});

app.post('/order', async (req, res, next) => {
  await db.collection('order').insertOne(req.body, (e, results) => {
    if (e) return next(e)
    res.status(201).send(results)
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
