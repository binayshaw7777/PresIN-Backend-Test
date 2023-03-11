require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Homepage");
})

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();