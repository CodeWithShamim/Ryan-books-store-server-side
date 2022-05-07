const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
require("dotenv").config();
const port = process.env.PORT || 5000;


// use middleware
app.use(cors())
app.use(express.json());


// -- verify jwt--
const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized access" })
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access" })
        }
        if (decoded) {
            req.decoded = decoded;
            next();
        }

    })

}


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
            console.log(quantity)

            let updateQuantity
            if (quantity == "Sold out") {
                updateQuantity = quantity;
            } else {
                updateQuantity = parseInt(quantity);
            }
            const updateDoc = {
                $set: {
                    quantity: (updateQuantity)
                },
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.json(result)

        })

        // ---delete item---
        app.delete('/deleteItem/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

        // ---add item---
        app.post('/addItem', async(req, res) => {
            const item = req.body;
            // console.log(item)
            const doc = {
                img: item.img,
                name: item.name,
                email: item.email,
                description: item.description,
                price: item.price,
                quantity: item.quantity,
                suppiler: item.suppiler,
            }
            const result = await itemsCollection.insertOne(doc);
            res.json(result);
        })

        // ---get item by email---
        app.get('/getItemByEmail', verifyJwt, async(req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;

            if (email === decodedEmail) {
                const query = { email: email }
                const cursor = itemsCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }
        })

        // ====JWT Auth====
        app.post('/login', async(req, res) => {
            const user = req.body;
            // console.log(user)
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_PRIVATE, { expiresIn: '1d' });
            res.send({ accessToken });

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
});