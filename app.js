require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/userRoutes.js');
const attendanceRoutes = require('./routes/attendanceRoutes.js');
const organizationRoutes = require('./routes/organizationRoutes.js');


app.get('/', (req, res) => {
    res.send("Homepage");
})

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/organization', organizationRoutes);


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