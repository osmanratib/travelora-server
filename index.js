const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
  // const userCollection = client.db('userDB').collection('users');

  // tveLora 

  app.get('/places', async (req, res) => {
   const result = await placesCollection.find().toArray()
   res.send(result)
  })

  app.get('/places/:id', async (req, res) => {
   const id = req.params.id;
   const query = { _id: new ObjectId(id) }
   const result = await placesCollection.findOne(query)
   res.send(result);
   console.log(result)
  })

  app.post('/places', async (req, res) => {
   const user = req.body;
   console.log(user);
   const result = await placesCollection.insertOne(user);
   res.send(result);
  })

  app.put('/places/:id', async (req, res) => {
   const id = req.params.id;
   const filter = { _id: new ObjectId(id) }
   const option = { upsert: true }
   const updatePlaces = req.body;
   const places = {
    $set: {
     image: updatePlaces.image,
     touristSpotName: updatePlaces.touristSpotName,
     country: updatePlaces.country,
     location: updatePlaces.location,
     description: updatePlaces.description,
     averageCost: updatePlaces.averageCost,
     seasonality: updatePlaces.seasonality,
     travelTime: updatePlaces.travelTime,
     totalVisitorsPerYear: updatePlaces.totalVisitorsPerYear
    }
   }

   const result = await placesCollection.updateOne(filter, places, option)
   res.send(result)

  })

  app.delete('/places/:id', async (req, res) => {
   const id = req.params.id;
   const query = { _id: new ObjectId(id) };
   const result = await placesCollection.deleteOne(query);
   res.send(result);
  });

  // myPlaces 
  app.get('/myPLaces', async (req, res) => {
   const email = req.query.email;
   const result = await placesCollection.find({ email }).toArray();
   res.send(result);
  })

  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 } finally {
 }
}
run().catch(console.dir);



app.get('/', (req, res) => {
 res.send('Travelora server is running')
})

app.listen(port, () => {
 console.log(`server is running on port ${port}`);
})
