const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());


const { MongoClient, ObjectID } = require('mongodb');

let db;

MongoClient.connect('mongodb://localhost:27017/todos', { useUnifiedTopology: true },  async function (err, client) {
  if (err) throw err

  db = client.db('todos');
  await db.collection('todos').deleteMany();

  await db.collection('todos').insertMany([
    { done: true, desc: 'write code' },
    { done: true, desc: 'fix bugs' },
    { done: false, desc: 'profit' }
  ]);
});//


app.get('/', (req, res) => {
  res.json('did this work!');
});

app.get('/todos', async (req, res) => {
  const todos = await db.collection('todos').find().toArray();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  await db.collection('todos').insertOne(req.body);
  res.json('posted');
});

app.delete('/todos/:id', async (req, res) => {
  await db.collection('todos').deleteOne({ _id: ObjectID(req.params.id) });
  res.json('deleted');
});

app.put('/todos/:id', async (req, res) => {
  await db.collection('todos').replaceOne({ _id: ObjectID(req.params.id)}, req.body);
  res.json('putted');
});

app.listen(3001, () => {
  console.log('work pls');
});
//