const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fsw2asc.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('red care is now running')
})

async function run() {
    try {
        // await client.connect()
        const database = client.db('redCare_db')
        const districtsCollection = database.collection('districts')
        const upazilasCollection = database.collection('upazilas')

        // get all districts/upazilas api
        app.get('/districts_upazilas', async (req, res) => {
            const districts = await districtsCollection.find().project({id:1, name:1}).toArray()
            const upazilas = await upazilasCollection.find().project({id:1, name:1}).toArray();
            res.send({ districts, upazilas })
        })


        // app.post('/upazilas', async (req, res) => {
        //     const newUpazilas = req.body
        //     const result = await upazilasCollection.insertOne(newUpazilas)
        //     res.send(result)
        // })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`red care server is running on port : ${port}`)
})