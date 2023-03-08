const express = require("express");
const cors = require("cors");
const databaseConntect = require("./utils/database");
const bookRouter = require("./routes/book.route");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());
app.use("/", bookRouter);

app.get("/", (req, res) => {
  res.send("server is running..........");
});

app.listen(port, () => {
  console.log("Listening to port is", port);
});
