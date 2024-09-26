const express = require("express");
const User = require("./user");
const router = express.Router();
const { upload } = require("./utils/multer");
const cloudinary = require("./utils/cloudinary");


 // Upload PDF to Cloudinary
 router.post("/", upload.single("pdf"), async(req, res)=>{

  const result = await cloudinary.uploader.upload(req.file.path);
  try {
      res.json(result)
  } catch (error) {
    console.log(error);
    
    return res.status(500).send({ message: 'Upload failed', error });
  }
})
 

router.post("/employee", upload.single("pdf"), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  try {
    // Destructure and set default values
    const {
      firstName,
      middleName,
      lastName,
      email,
      gender,
      address,
      dateOfBirth,
      maritalStatus,
      religion,
      educationalQualification,
      nationality,
      languageSpoken,
      phoneNo = { code: "", phone: "" },
      emergencyContact = {
        name: "",
        phoneNo: { code: "", phone: "" },
        relationship: "",
        address: "",
      },
      officialDetails = {
        employeeId: "",
        jobTitle: "",
        department: "",
        email: "",
        phoneNo: { code: "", phone: "" }, // Ensure phoneNo is an object
        reportingOfficer: "",
        workSchedule: "",
        employmentType: "",
        region: "",
        role: "",
        basicSalary: 0,
        startingDate: null,
        contractEndDate: null,
        skills: [],
      },
      bankDetails = {
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        bicCode: "",
      },
    } = req.body;

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      gender,
      address,
      dateOfBirth,
      maritalStatus,
      religion,
      educationalQualification,
      nationality,
      languageSpoken,
      phoneNo: {
        code: phoneNo.code,
        phone: phoneNo.phone,
      },
      document: result.secure_url, // File path
      cloudinary_id:result.public_id,

      emergencyContact: {
        name: emergencyContact.name,
        phoneNo: {
          code: emergencyContact.phoneNo.code,
          phone: emergencyContact.phoneNo.phone,
        },
        relationship: emergencyContact.relationship,
        address: emergencyContact.address,
      },
      officialDetails: {
        employeeId: officialDetails.employeeId,
        jobTitle: officialDetails.jobTitle,
        department: officialDetails.department,
        email: officialDetails.email,
        phoneNo: {
          code: officialDetails.phoneNo.code,
          phone: officialDetails.phoneNo.phone,
        },
        reportingOfficer: officialDetails.reportingOfficer,
        workSchedule: officialDetails.workSchedule,
        employmentType: officialDetails.employmentType,
        region: officialDetails.region,
        region: officialDetails.role,
        basicSalary: officialDetails.basicSalary,
        startingDate: officialDetails.startingDate,
        contractEndDate: officialDetails.contractEndDate,
        skills: officialDetails.skills,
      },
      bankDetails: {
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountHolderName: bankDetails.accountHolderName,
        bicCode: bankDetails.bicCode,
      },
      created: new Date(), // Set created date
    });

    await newUser.save();
    res.status(200).json({ message: "User created successfully!" });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error saving user:", error);
    res.status(400).json({ error: error.message });
  }
});

// get all users

router.get("/employees", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// search by first name, region, employee id
router.get("/employees/:firstName", async (req, res) => {
  const firstname = req.params.firstName;
  console.log(firstname);
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: firstname, $options: "i" } },
        { "officialDetails.region": { $regex: firstname, $options: "i" } },
        { "officialDetails.employeeId": { $regex: firstname, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// update a user

router.patch("/employee/:id", async (req, res) => {
  const { id } = req.params;
  const updateFields = {};

  // Check for emergency contact fields
  if (req.body.emergencyContact) {
    if (req.body.emergencyContact.name) {
      updateFields["emergencyContact.name"] = req.body.emergencyContact.name;
    }
    if (req.body.emergencyContact.phoneNo) {
      if (req.body.emergencyContact.phoneNo.code) {
        updateFields["emergencyContact.phoneNo.code"] =
          req.body.emergencyContact.phoneNo.code;
      }
      if (req.body.emergencyContact.phoneNo.phone) {
        updateFields["emergencyContact.phoneNo.phone"] =
          req.body.emergencyContact.phoneNo.phone;
      }
    }
    if (req.body.emergencyContact.relationship) {
      updateFields["emergencyContact.relationship"] =
        req.body.emergencyContact.relationship;
    }
    if (req.body.emergencyContact.address) {
      updateFields["emergencyContact.address"] =
        req.body.emergencyContact.address;
    }
  }

  // Check for official details fields
  if (req.body.officialDetails) {
    if (req.body.officialDetails.employeeId) {
      updateFields["officialDetails.employeeId"] =
        req.body.officialDetails.employeeId;
    }
    if (req.body.officialDetails.jobTitle) {
      updateFields["officialDetails.jobTitle"] =
        req.body.officialDetails.jobTitle;
    }
    if (req.body.officialDetails.department) {
      updateFields["officialDetails.department"] =
        req.body.officialDetails.department;
    }
    if (req.body.officialDetails.email) {
      updateFields["officialDetails.email"] = req.body.officialDetails.email;
    }
    if (req.body.officialDetails.phoneNo) {
      if (req.body.officialDetails.phoneNo.code) {
        updateFields["officialDetails.phoneNo.code"] =
          req.body.officialDetails.phoneNo.code;
      }
      if (req.body.officialDetails.phoneNo.phone) {
        updateFields["officialDetails.phoneNo.phone"] =
          req.body.officialDetails.phoneNo.phone;
      }
    }
    if (req.body.officialDetails.reportingOfficer) {
      updateFields["officialDetails.reportingOfficer"] =
        req.body.officialDetails.reportingOfficer;
    }
    if (req.body.officialDetails.workSchedule) {
      updateFields["officialDetails.workSchedule"] =
        req.body.officialDetails.workSchedule;
    }
    if (req.body.officialDetails.employmentType) {
      updateFields["officialDetails.employmentType"] =
        req.body.officialDetails.employmentType;
    }
    if (req.body.officialDetails.region) {
      updateFields["officialDetails.region"] = req.body.officialDetails.region;
    }
    if (req.body.officialDetails.role) {
      updateFields["officialDetails.role"] = req.body.officialDetails.role;
    }
    if (req.body.officialDetails.basicSalary) {
      updateFields["officialDetails.basicSalary"] =
        req.body.officialDetails.basicSalary;
    }
    if (req.body.officialDetails.startingDate) {
      updateFields["officialDetails.startingDate"] =
        req.body.officialDetails.startingDate;
    }
    if (req.body.officialDetails.contractEndDate) {
      updateFields["officialDetails.contractEndDate"] =
        req.body.officialDetails.contractEndDate;
    }
    if (req.body.officialDetails.skills) {
      updateFields["officialDetails.skills"] = req.body.officialDetails.skills;
    }
  }

  // Check for bank details fields
  if (req.body.bankDetails) {
    if (req.body.bankDetails.bankName) {
      updateFields["bankDetails.bankName"] = req.body.bankDetails.bankName;
    }
    if (req.body.bankDetails.accountHolderName) {
      updateFields["bankDetails.accountHolderName"] =
        req.body.bankDetails.accountHolderName;
    }
    if (req.body.bankDetails.accountNumber) {
      updateFields["bankDetails.accountNumber"] =
        req.body.bankDetails.accountNumber;
    }
    if (req.body.bankDetails.bicCode) {
      updateFields["bankDetails.bicCode"] = req.body.bankDetails.bicCode;
    }
  }

  // Check and add fields to updateFields if they exist in the request body
  if (req.body.firstName) updateFields.firstName = req.body.firstName;
  if (req.body.middleName) updateFields.middleName = req.body.middleName;
  if (req.body.lastName) updateFields.lastName = req.body.lastName;
  if (req.body.email) updateFields.email = req.body.email;
  // Check and add fields to updateFields if they exist in the request body
  if (req.body.phoneNo) {
    updateFields.phoneNo = updateFields.phoneNo || {}; // Initialize if undefined
    if (req.body.phoneNo.code)
      updateFields.phoneNo.code = req.body.phoneNo.code;
    if (req.body.phoneNo.phone)
      updateFields.phoneNo.phone = req.body.phoneNo.phone;
  }
  if (req.body.gender) updateFields.gender = req.body.gender;
  if (req.body.address) updateFields.address = req.body.address;
  if (req.body.dateOfBirth) updateFields.dateOfBirth = req.body.dateOfBirth;
  if (req.body.maritalStatus)
    updateFields.maritalStatus = req.body.maritalStatus;
  if (req.body.region) updateFields.region = req.body.region;
  if (req.body.religion) updateFields.religion = req.body.religion;
  if (req.body.educationalQualification)
    updateFields.educationalQualification = req.body.educationalQualification;
  if (req.body.nationality) updateFields.nationality = req.body.nationality;
  if (req.body.languageSpoken)
    updateFields.languageSpoken = req.body.languageSpoken;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Use $set to apply only the specified updates
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the user.");
  }
});

// delete a user

router.delete("/employee/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(user.cloudinary_id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error", error });
  }
});

module.exports = router;
