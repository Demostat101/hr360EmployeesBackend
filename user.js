const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  active: { type: Boolean,default:true },
  email: { type: String },
  phoneNo: {
    code: String,
    phone: String,
  },
  address: { type: String },
  dateOfBirth: { type: Date },
  maritalStatus: { type: String },
  religion: { type: String },
  educationalQualification: { type: String },
  nationality: { type: String },
  document: { type: String },
  languageSpoken: { type: String },

  emergencyContact: {
    name: String,
    phoneNo: {
      code: String,
      phone: String,
    },
    relationship: String,
    address: String,
  },
  officialDetails: {
    employeeId: String,
    jobTitle: String,
    department: String,
    email: String,
    phoneNo: {
      code: String,
      phone: String,
    },
    reportingOfficer: String,
    workSchedule: String,
    employmentType: String,
    region: String,
    role: String,
    basicSalary: Number,
    startingDate: Date,
    contractEndDate: Date,
    skills: [String],
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountHolderName: String,
    bicCode: String,
  },
  cloudinary_id: {
    type:String,
    required:false
    
},
  created: { type: Date, required: true, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
