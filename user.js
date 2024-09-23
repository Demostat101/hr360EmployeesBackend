const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    email: { type: String },
    phoneNo: { type: String },
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
        phoneNo: String,
        relationship: String,
        address: String,
    },
    officialDetails: {
        employeeId: String,
        jobTitle: String,
        department: String,
        email: String,
        phoneNo: String,
        reportingOfficer: String,
        workSchedule: String,
        employmentType: String,
        region: String,
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
    created: { type: Date, required: true, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
