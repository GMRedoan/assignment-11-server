const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('rent wheels is now running')
})

app.listen(port, () => {
    console.log(`rent wheels server is running on port : ${port}`)
})