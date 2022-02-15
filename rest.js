const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const http = require("http")
const app = express()
const port = process.env.PORT || 3000

// MIDDLEWARES
// use Parser Middleware
app.use(express.json())

// use Logger middleware
app.use(function (req, res, next) {
  console.log('Request IP: ' + req.url)
  console.log('Request date: ' + new Date())
  return next()
})

// use static file middleware
app.use(function (req, res, next) {
  const filePath = path.join(__dirname, 'static', req.url)
  fs.stat(filePath, function (err, fileInfo) {
    if (err) return next()
    if (fileInfo.isFile()) res.sendFile(filePath)
    else next()
  })
})

// CORS allows you to configure the web API's security. 
// It has to do with allowing other domains to make requests against your web API.
app.use(cors());

const { MongoClient } = require('mongodb')
const username = 'favourfelix'
const password = 'emmanuel'
const dbName = 'afterschool'
let db = null

// Connect to MongoDB database
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

// Endpoint to get all lessons
app.get('/lessons', async function (req, res, next) {
  await db.collection('lesson').find().toArray((e, results) => {
    if (e) return next(e)
    res.json(results)
  })
});

// Endpoint to add an order
app.post('/order', async function (req, res, next) {
  await db.collection('order').insertOne(req.body, (e, results) => {
    if (e) return next(e)
    res.status(201).send(results)
  })
})

// Listen to port
app.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`);
});
