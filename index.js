const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y5kfv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db("volunteerNetwork").collection("volunteerInfo");
  const eventCollection = client.db("volunteerNetwork").collection("eventInfo");

  app.post('/addVolunteer', (req, res) => {
      const volunteer = req.body;
      volunteerCollection.insertOne(volunteer)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/volunteerInformation' , (req, res)=>{
    volunteerCollection.find({email: req.query.email})
    .toArray((err, document)=>{
      res.send(document);
    })
  })

  app.get('/volunteerList' , (req, res)=>{
    volunteerCollection.find({})
    .toArray((err, document)=>{
      res.send(document);
    })
  })

  app.delete('/deleteVolunteer',(req , res)=>{
    volunteerCollection.deleteOne({_id: ObjectId(req.headers.id)})
    .then(result=>{
      res.send(result.deletedCount > 0)
    })
  })

  app.delete('/deleteVolunteerEvent',(req , res)=>{
    volunteerCollection.deleteOne({_id: ObjectId(req.headers.id)})
    .then(result=>{
      res.send(result.deletedCount > 0)
    })
  })

  // Event Collection
  app.post('/addEvent', (req, res) => {
    const event = req.body;
    eventCollection.insertOne(event)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/newEventList' , (req, res)=>{
    eventCollection.find({})
    .toArray((err, document)=>{
      res.send(document);
    })
  })
  
});

app.get('/', (req, res) => {
  res.send('Welcome to Volunteer Network')
})

app.listen(PORT);