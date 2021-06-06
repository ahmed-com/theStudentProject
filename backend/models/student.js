const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: String,
  gpa: Number,
  pic: String
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;