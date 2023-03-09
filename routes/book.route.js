const express = require("express");
const getDB = require("../utils/database");
const router = express.Router();

const jwt = require("jsonwebtoken");
const verifyJwt = require("../middlewars/VerifyJWT");

// get all items
router.get("/items", async (req, res) => {
  const query = {};
  const db = await getDB();
  const cursor = await db.itemsCollection?.find(query);
  const result = await cursor.toArray();

  res.send(result);
});

// get single item by id
router.get("/items/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const db = await getDB();
  const result = await db.itemsCollection.findOne(query);
  res.send(result);
});

// ---update quantity---
router.put("/updateQuantity/:id", async (req, res) => {
  const id = req.params.id;
  const quantity = req.body.newQuantity;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };

  let updateQuantity;
  if (quantity == "Sold out") {
    updateQuantity = quantity;
  } else {
    updateQuantity = parseInt(quantity);
  }
  const updateDoc = {
    $set: {
      quantity: updateQuantity,
    },
  };

  const db = await getDB();
  const result = await db.itemsCollection.updateOne(filter, updateDoc, options);
  res.json(result);
});

// ---delete item---
router.delete("/deleteItem/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const db = await getDB();
  const result = await db.itemsCollection.deleteOne(query);
  res.send(result);
});

// ---add item---
router.post("/addItem", async (req, res) => {
  const item = req.body;
  const doc = {
    img: item.img,
    name: item.name,
    email: item.email,
    description: item.description,
    price: item.price,
    quantity: item.quantity,
    suppiler: item.suppiler,
  };

  const db = await getDB();
  const result = await db.itemsCollection.insertOne(doc);
  res.json(result);
});

// ---get item by email---
router.get("/getItemByEmail", verifyJwt, async (req, res) => {
  const decodedEmail = req.decoded.email;
  const email = req.query.email;

  console.log(email);

  if (email === decodedEmail) {
    const query = { email: email };
    const db = await getDB();
    const cursor = db.itemsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } else {
    res.status(403).send({ message: "Forbidden access" });
  }
});

// ====JWT Auth====
router.post("/login", async (req, res) => {
  const user = req.body;
  // console.log(user)
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_PRIVATE, {
    expiresIn: "7d",
  });
  res.send({ accessToken });
});

// ==================get featured books item=====================
router.get("/getFeatured", async (req, res) => {
  const query = {};
  const db = await getDB();
  const cursor = await db.featuredCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

module.exports = router;
