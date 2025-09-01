const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const mongoUrl = process.env.MONGODB_URL;
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8001;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

mongoose.connect(mongoUrl, {
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
  serialNumber: { type: String, unique: true },
  uniqueId: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  level: { type: String, required: true },
  college: { type: String, required: true },
  year: { type: Number, required: true },
  department: { type: String, required: true },
  event: { type: String, required: true },
  date: { 
    type: Date, 
    default: () => {
      const now = new Date();
      // IST is UTC+5:30
      return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    }
  },
  attendance: { type: Boolean, default: false }
});

// Pre-save hook to auto-increment serialNumber
symposiumSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'symposiumSerial' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.serialNumber = "VIBE_0" + counter.seq;
  }
  next();
});

const User = mongoose.model('User', symposiumSchema);

app.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const userData = req.body;
        console.log('Received user data:', userData);
        const newUser = new User(userData);
        await newUser.save();
        res.status(201).send({
            message: 'Registration successful',
            name: newUser.name,
            serialNumber:newUser.serialNumber,
            uniqueId: newUser.uniqueId,
            event: newUser.event,
        });
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get participant by uniqueId
app.get('/participant/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const participant = await User.findOne({ uniqueId });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.json(participant);
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Mark attendance
app.put('/participant/mark/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const participant = await User.findOne({ uniqueId });

    if (!participant) return res.status(404).send('Participant not found');

    if (participant.attendance) return res.send('Attendance already marked ✅');

    participant.attendance = true;
    await participant.save();

    res.send('Attendance marked successfully ✅');
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin-data', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/mark-present', async (req, res) => {
    const { serialNumber, uniqueId } = req.body;

    try {
        const participant = await User.findOne({ serialNumber, uniqueId });

        if (!participant) {
            return res.status(404).send('Participant not found');
        }

        if (participant.attendance) {
            return res.send('Attendance already marked ✅');
        }

        participant.attendance = true;
        await participant.save();

        res.send('Attendance marked successfully ✅');
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/mark-absent', async (req, res) => {
    const { serialNumber, uniqueId } = req.body;

    try {
        const participant = await User.findOne({ serialNumber, uniqueId });

        if (!participant) {
            return res.status(404).send('Participant not found');
        }

        if (!participant.attendance) {
            return res.send('Absent');
        }

        participant.attendance = false;
        await participant.save();

        res.send('Attendance marked successfully ✅');
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/fetchId', async (req, res) => {
  console.log("HELLO  FROM FETCH ID");
    const { email, mobile } = req.body;

    try {
        const participant = await User.findOne({ email, mobile }) || "";

        if (!participant) {
            return res.status(400).send('Participant not found');
        }
        res.json({ id: participant.uniqueId, serialNumber: participant.serialNumber,name: participant.name,event: participant.event });
        if(participant)
          console.log(participant);
    } catch (error) {
        console.error('Error fetching ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});
