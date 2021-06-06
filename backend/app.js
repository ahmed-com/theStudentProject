const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({storage:multer.diskStorage({
  destination: './public/images',
  filename: (req,file,cb)=>{
    cb(null,file.fieldname + '_' + Date.now() + path.extname(file.originalname))
  }
})});
const morgan = require('morgan');

const Student = require('./models/student');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/students', async (req, res) => {
  console.log('TRYING TO FETCH STUDENTS');
  try {
    const students = await Student.find();
    res.status(200).json({
      students: students.map((student) => ({
        id: student.id,
        name: student.name,
        gpa: student.gpa,
        pic: student.pic
      })),
    });
    console.log('FETCHED STUDENTS');
  } catch (err) {
    console.error('ERROR FETCHING STUDENTS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load students.' });
  }
});

app.post('/students',upload.single('file'), async (req, res) => {
  console.log('TRYING TO STORE STUDENT');
  const studentName = req.body.name;
  const studentGPA = req.body.gpa;
  const studentPic = req.file?.filename || '';

  console.log(studentPic)

  if (!studentName || studentName.trim().length === 0) {
    console.log('INVALID INPUT - NO NAME');
    return res.status(422).json({ message: 'Invalid student name.' });
  }

  if (!studentGPA || isNaN(studentGPA)){
    console.log('INVALID INPUT - NO GPA OR NAN')
    return res.status(422).json({ message: 'Invalid student GPA.' });
  }

  const student = new Student({
    name: studentName,
    gpa: studentGPA,
    pic: studentPic
  });

  try {
    await student.save();
    res
      .status(201)
      .json({ message: 'Student saved', student: { id: student.id, name: studentName, gpa: studentGPA, pic: studentPic } });
    console.log('STORED NEW STUDENT');
  } catch (err) {
    console.error('ERROR FETCHING STUDENTS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save student.' });
  }
});

app.delete('/students/:id', async (req, res) => {
  console.log('TRYING TO DELETE STUDENT');
  try {
    await Student.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted student!' });
    console.log('DELETED STUDENT');
  } catch (err) {
    console.error('ERROR FETCHING STUDENTS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete student.' });
  }
});

mongoose.connect(
  `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/students?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB!!');
      app.listen(80);
    }
  }
);
