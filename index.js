/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Port = process.env.Port || 5000;
const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rqwof3p.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const userCollection = client.db('aircnc').collection('users');
        const bookingCollection = client.db('aircnc').collection('bookings');

        app.put('/user/:email', async (req, res) => {
            const { email } = req.params;
            const user = req.body;
            const filter = { email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            // console.log(result);

            const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' });
            // console.log(token);
            res.send({ result, token });

            app.post('/bookings', async (req, res) => {
                const bookingData = req.body;
                const result = await bookingCollection.insertOne(bookingData);
                console.log(result);
                res.send(result);
            });

            console.log('Database Connected');
        });
    } finally {
    }
}
run().catch((error) => console.error(error.message));

app.get('/', (req, res) => {
    res.send('Aircnc Server Running');
});

app.listen(Port, () => {
    console.log(`Aircnc Server Running on Port ${Port}`);
});
