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


const counterSchema1 = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "team" / "student"
  seq: { type: Number, default: 0 },
});

const Counter1 = mongoose.model("Counter1", counterSchema1);

// Function to get next sequence with prefix
async function getNextSequence1(name, prefix) {
  const counter = await Counter1.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return prefix + counter.seq.toString().padStart(2, "0"); // 01, 02, 03...
}



// ---------------- New Schemas for Team Registration ----------------
const studentSchema = new mongoose.Schema({
  studentNo: { type: String, unique: true }, // 🔢 Auto-increment student number
  name: { type: String, required: true },
  regNo: { type: String, required: true }, // email/roll no
  events: { type: [String], default: [] }, // selected events
  mobile:{type:String,required:true},
  college:{type:String},
  department:{type:String},
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  teamName: { type: String }, // extra field to save teamName directly
  teamNo: { type: String }, // extra field to save teamNo directly
  imgUrl:{type:String},
  transactionId: { type: String },
  a1:{ type: String, enum: ["Present", "Absent"], default: "Absent" },
  a2:{ type: String, enum: ["Present", "Absent"], default: "Absent" },
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
});

const Student = mongoose.model("Student", studentSchema);

const teamSchema = new mongoose.Schema({
  teamNo: { type: String, unique: true }, // 🔢 Auto-increment team number
  uniqueId: { type: String, default: uuidv4, unique: true }, // random UUID
  teamName: { type: String, required: true },
  collegeName: { type: String, required: true },
  dept: { type: String, required: true },
  imgUrl:{type:String},
  transactionId: { type: String },
  // Store events as { "Event 1": [studentRegNos] }
  event: {
    type: Map,
    of: [String],
    default: {},
  },

  // 🚀 Direct store student objects instead of ObjectId
  members: [
    {
      studentNo: { type: String }, // 🔢 Local to team OR global — your choice
      name: { type: String, required: true },
      regNo: { type: String, required: true },
      mobile:{type:String, required:true},
      events: { type: [String], default: [] },
      status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
    },
  ],
});

const Team = mongoose.model("Team", teamSchema);

// ---------------- Existing Routes ----------------


app.post('/register', async (req, res) => {
  try {
    const { name, regNo, mobile, college, department, events, imgUrl, transactionId } = req.body;

    // Check if student with this regNo already exists
    const existingStudent = await Student.findOne({ regNo });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already registered with this email.' });
    }

    // Create new student
    const newStudent = new Student({
      studentNo: await getNextSequence1("student", "VS"),
      name,
      regNo, // email id
      mobile,
      college,
      teamName: "SOLO-REG",
      teamNo: "SOLO",
      department,
      imgUrl,
      transactionId,
      events,
    });

    await newStudent.save();

    // ✅ Mail transporter setup with explicit host/port & debug
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,          // 465 secure true / 587 secure false
      secure: false,      // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
      logger: true,
      debug: true,
      connectionTimeout: 10000, // 10 seconds timeout
    });

    // ✅ Mail content
    const mailOptions = {
      from: `VIBE Registration <${process.env.EMAIL_USER}>`,
      to: newStudent.regNo,
      subject: "VIBE Registration Successful 🎉",
      html: `
        <h2>Hi ${newStudent.name},</h2>
        <p>You have been successfully registered for the event.</p>
        <p><b>College:</b> ${newStudent.college}</p>
        <p><b>Department:</b> ${newStudent.department}</p>
        <p><b>Student No:</b> ${newStudent.studentNo}</p>
        <p><b>Events:</b></p>
        <ul>
          ${newStudent.events.map(e => `<li>${e}</li>`).join("")}
        </ul>
        <br/>
        <p>All the best 👍</p>
      `,
    };

    // ✅ Send mail with separate try-catch
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${newStudent.regNo}`);
    } catch (mailError) {
      console.error('Email sending failed:', mailError);
      // Optional: continue without breaking registration
    }

    res.status(201).json({
      message: 'Registration successful 🎉', // even if mail fails
      name: newStudent.name,
      studentNo: newStudent.studentNo,
      events: newStudent.events,
    });

  } catch (error) {
    console.error('Error registering student:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
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
    const { teamName, event, members, collegeName, dept , imgUrl, transactionId } = req.body;

    // 1. Duplicate regNo check
    const regNos = members.map((m) => m.regNo);
    const duplicate = regNos.find((regNo, i) => regNos.indexOf(regNo) !== i);
    if (duplicate) {
      return res.status(400).json({ error: `Duplicate RegNo in team: ${duplicate}` });
    }

    // 2. Already registered students check
    const existingStudents = await Student.find({ regNo: { $in: regNos } });
    if (existingStudents.length > 0) {
      return res.status(400).json({
        error: "Some emails already registered",
        existing: existingStudents.map((s) => s.regNo),
      });
    }

    // 3. Generate Team No (VTxx)
    const teamNo = await getNextSequence1("team", "VT");

    // 4. Prepare members with events + studentNo
    const membersWithEvents = [];
    for (const m of members) {
      const studentEvents = Object.entries(event)
        .filter(([eventName, participants]) =>
          participants.includes(`${m.name} (${m.regNo})`)
        )
        .map(([eventName]) => eventName);

      const studentNo = await getNextSequence1("student", "VS");

      membersWithEvents.push({
        ...m,
        studentNo,
        mobile: m.mobile,
        events: studentEvents,
      });
    }

    // 5. Create Team
    const newTeam = new Team({
      teamNo,
      teamName,
      event,
      collegeName,
      dept,
      members: membersWithEvents,
      imgUrl,
      transactionId,
    });
    await newTeam.save();

    // 6. Save Students
    const studentDocs = await Student.insertMany(
      membersWithEvents.map((m) => ({
        studentNo: m.studentNo,
        name: m.name,
        regNo: m.regNo,
        team: newTeam._id,
        teamNo: newTeam.teamNo,
        teamName,
        transactionId,
        imgUrl,
        events: m.events,
        mobile: m.mobile,
        status: m.status || "Absent",
      }))
    );

    // 7. Send Emails (separate try-catch)
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
        from: `"VIBE Registration" <${process.env.EMAIL_USER}>`,
        to: student.regNo,
        subject: "VIBE Registration Successful 🎉",
        html: `
          <h2>Hi ${student.name},</h2>
          <p>You have been successfully registered for the event.</p>
          <p><b>Team Name:</b> ${teamName} (${newTeam.teamNo})</p>
          <p><b>College:</b> ${collegeName}</p>
          <p><b>Department:</b> ${dept}</p>
          <p><b>Student No:</b> ${student.studentNo}</p>
          <p><b>Events:</b></p>
          <ul>
            ${student.events.map((e) => `<li>${e}</li>`).join("")}
          </ul>
          <br/>
          <p>All the best 👍</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${student.regNo}`);
      } catch (mailError) {
        console.error(`Email failed for ${student.regNo}:`, mailError);
        // Continue without breaking registration
      }
    }

    // 8. Response (always success)
    res.json({
      message: "Team registered successfully with VTxx/VSxx numbers 🎉",
      team: newTeam,
      students: studentDocs,
    });

  } catch (err) {
    console.error("Error in /team-register:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /team-scanner/:uniqueId
app.get("/team-scanner/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;

    // Find the team with members
    const team = await Team.findOne({ uniqueId });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /scanner/attendance/:regNo
app.put("/scanner/attendance/:regNo", async (req, res) => {
  try {
    const { regNo } = req.params;
    const { status } = req.body; // "Present" or "Absent"

    // 1️⃣ Update Student collection
    const student = await Student.findOneAndUpdate(
      { regNo },
      { status },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // 2️⃣ Update inside Team.members[]
    await Team.updateOne(
      { "members.regNo": regNo },
      { $set: { "members.$.status": status } }
    );

    res.json({ message: `${student.name} marked as ${status}` });
  } catch (err) {
    console.error("Error updating attendance:", err);
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

app.put('/students/:studentId/status', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body; // "Present" or "Absent"

    const student = await Student.findByIdAndUpdate(
      studentId,
      { status },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: `Student status updated to ${status}`, student });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});
