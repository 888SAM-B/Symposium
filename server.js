const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8001;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

mongoose.connect('mongodb+srv://symposiummca:SyMpOsIuMMcA@cluster0.llerbz9.mongodb.net/symposium', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const Schema = mongoose.Schema;

// Counter schema for serial numbers
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// Symposium schema with serialNumber & uniqueId
const symposiumSchema = new Schema({
    serialNumber: { type: Number, unique: true },
    uniqueId: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    level: { type: String, required: true },
    college: { type: String, required: true },
    year: { type: Number, required: true },
    department: { type: String, required: true },
    event: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Pre-save hook to auto-increment serialNumber
symposiumSchema.pre('save', async function(next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'symposiumSerial' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.serialNumber = counter.seq;
    }
    next();
});

const User = mongoose.model('User', symposiumSchema);

app.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        console.log('Received user data:', userData);
        const newUser = new User(userData);
        await newUser.save();
        res.status(201).send({
            message: 'Registration successful',
            serialNumber: newUser.serialNumber,
            uniqueId: newUser.uniqueId
        });
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
