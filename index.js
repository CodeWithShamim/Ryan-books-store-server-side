const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;


// use middleware
app.use(cors())
app.use(express.json());


// -- db added --

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehdfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db("booksItems").collection("items");
        const query = {};

        // get all items 
        app.get('/items', async(req, res) => {
            const cursor = await itemsCollection.find(query);
            const result = await cursor.toArray();

            res.send(result);
        })

        // get single item by id 
        app.get('/items/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await itemsCollection.findOne(query);
            res.send(result);

        })

        // ---update quantity---
        app.put('/updateQuantity/:id', async(req, res) => {
            const id = req.params.id;
            const quantity = req.body.newQuantity;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: parseInt(quantity)
                },
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.json(result)

        })
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Ryan books store server is running..........")
});

app.listen(port, () => {
    console.log("Listening to port is", port)
})