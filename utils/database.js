const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

let client;
const databaseConntect = async () => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehdfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  }

  try {
    await client.connect();
    const itemsCollection = client.db("booksItems").collection("items");
    const featuredCollection = client
      .db("booksItems")
      .collection("featuredItems");

    return {
      itemsCollection,
      featuredCollection,
    };
  } catch (error) {
    console.log("DB connect error", error);
  }
};

module.exports = databaseConntect;
