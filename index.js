const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@travelora-cluster.hlalkba.mongodb.net/?appName=travelora-cluster`;
const client = new MongoClient(uri, {
 serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
 }
});

async function run() {
 try {
  await client.connect();


  //collections 

  const placesCollection = client.db('placeDB').collection('places');

  // tveLora 

  app.post('/places', async (req, res) => {
   const user = req.body;
   const result = await placesCollection.insertOne(user);
   res.send(result);
  })


  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 } finally {
  // await client.close();
 }
}
run().catch(console.dir);



app.get('/', (req, res) => {
 res.send('Travelora server is running')
})

app.listen(port, () => {
 console.log(`server is running on port ${port}`);
})
