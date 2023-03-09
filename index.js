const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const databaseConntect = require("./utils/database");
const bookRouter = require("./routes/book.route");
const app = express();
require("dotenv").config();

// use middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/", bookRouter);

app.get("/", (req, res) => {
  res.send("server is running..........");
});

app.listen(port, () => {
  console.log("Listening to port is", port);
});
