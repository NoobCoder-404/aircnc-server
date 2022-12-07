const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Port = process.env.Port || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(Port, () => {
    console.log(`Server Running on Port ${Port}`);
});
