const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer=require("nodemailer");
require('dotenv').config();
const mongoUrl = process.env.MONGODB_URL;
const { v4: uuidv4 } = require('uuid');
const { sendMail } = require("./mailer.js");
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

// ---------------- Existing Symposium Schema ----------------
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
      return new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // IST
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

// ---------------- New Schemas for Team Registration ----------------
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true, unique: true }, // email
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
});

const Student = mongoose.model("Student", studentSchema);

const teamSchema = new mongoose.Schema({
  uniqueId: { type: String, default: uuidv4, unique: true }, // unique team id
  teamName: { type: String, required: true, unique: true },
  collegeName: { type: String, required: true },
  dept: { type: String, required: true },

  // Store events as { "Event 1": [studentRegNos] }
  event: {
    type: Map,
    of: [String], 
    default: {},
  },

  // 🚀 Direct store student objects instead of ObjectId
  members: [
    {
      name: { type: String, required: true },
      regNo: { type: String, required: true },
      status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
    },
  ],
});

const Team = mongoose.model("Team", teamSchema);

// ---------------- Existing Routes ----------------
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
// POST /api/check-regnos
app.post("/api/check-regnos", async (req, res) => {
  try {
    const { regNos } = req.body;

    if (!regNos || !Array.isArray(regNos)) {
      return res.status(400).json({ error: "regNos array is required" });
    }

    // 🔎 Use Student model instead of Registration
    const existing = await Student.find({ regNo: { $in: regNos } });

    // Collect the regNos that are already in DB
    const exists = existing.map((s) => s.regNo);

    res.json({ exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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


app.post('/check',async(req,res)=>{
  const college=req.body.college;
  console.log(college)
  const collegeName = await Team.findOne({
  teamName: { $regex: `^${college}$`, $options: "i" }
});

  if(collegeName){
    res.send({exists:true})
  }
  else{
    res.send({exists:false})
  }

})

// ---------------- New Routes for Team Registration ----------------
// Register Team


app.post("/team-register", async (req, res) => {
  try {
    const { teamName, event, members, collegeName, dept } = req.body;

    // 1. Duplicate regNo check inside same request
    const regNos = members.map((m) => m.regNo);
    const duplicate = regNos.find((regNo, i) => regNos.indexOf(regNo) !== i);
    if (duplicate) {
      return res.status(400).json({ error: `Duplicate RegNo in team: ${duplicate}` });
    }

    // 2. Already registered students check
    const existingStudents = await Student.find({ regNo: { $in: regNos } });
    if (existingStudents.length > 0) {
      return res.status(400).json({
        error: "Some regNos already registered",
        existing: existingStudents.map((s) => s.regNo),
      });
    }

    // 3. Create Team with members included
    const newTeam = new Team({
      teamName,
      event,
      collegeName,
      dept,
      members, // 👈 fix: directly include members array
    });
    await newTeam.save();

    // 4. Save students separately
    const studentDocs = await Student.insertMany(
      members.map((m) => ({
        name: m.name,
        regNo: m.regNo, // here regNo is email
        team: newTeam._id,
        status: m.status || "Absent",
      }))
    );

    // 5. Send email to each regNo (email)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const student of studentDocs) {
      const mailOptions = {
        from: `"Event Registration" <${process.env.EMAIL_USER}>`,
        to: student.regNo,
        subject: "VIBE Registration Successful 🎉",
        html: `
          <h2>Hi ${student.name},</h2>
          <p>You have been successfully registered for the event.</p>
          <p><b>Team Name:</b> ${teamName}</p>
          <p><b>College:</b> ${collegeName}</p>
          <p><b>Department:</b> ${dept}</p>
          <p><b>Event:</b> ${JSON.stringify(event)}</p>
          <br/>
          <p>All the best 👍</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({
      message: "Team registered successfully and confirmation mails sent",
      team: newTeam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// Get all teams
app.get("/teams", async (req, res) => {
  const teams = await Team.find().populate("members");
  res.json(teams);
});

// Get all students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// ---------------------------------------------------

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
