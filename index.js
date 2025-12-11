const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection = database.collection('users')

        // get all districts/upazilas api
        app.get('/districts_upazilas', async (req, res) => {
            const districts = await districtsCollection.find().project({ id: 1, name: 1 }).toArray()
            const upazilas = await upazilasCollection.find().project({ id: 1, name: 1 }).toArray();
            res.send({ districts, upazilas })
        })

        // get users api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/role/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })


        app.post('/users', async (req, res) => {
            const userInfo = req.body
            const email = req.body.email
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: 'already added this user in database' })
            }
            else {
                const result = await usersCollection.insertOne(userInfo)
                res.send(result)
            }
        })

        // update the user information
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id
            const updatedUser = req.body
            delete updatedUser._id
            const query =  { _id: new ObjectId(id) }
            const update = {
                $set: updatedUser
            }
            const result = await usersCollection.updateOne(query, update)
            res.send(result)
        })

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