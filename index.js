const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// use middleware

app.get('/', (req, res) => {
    res.send("Ryan books store server is running..........")
});

app.listen(port, () => {
    console.log("Listening to port is", port)
})