const express = require("express");
const User = require("./user");
const router = express.Router();
const {upload} = require("./utils/multer")
// const multer = require("multer");
// const upload = multer({dest:"./files"})
// const upload = require("./utils/multer");

//  insert image

// router.post("/", upload.single("image"), async(req, res)=>{
//     const result = await cloudinary.uploader.upload(req.file.path);
//     try {
//         res.json(result)
//     } catch (error) {
//         console.log(error)
//     }
// })

// insert a user into database route
// const result = await cloudinary.uploader.upload(req.file.path);

router.post('/employee', upload.single("file"), async (req, res) => {
  try {
      // Destructure nested properties with default values
      const {
          firstName,
          lastName,
          middleName,
          email,
          phoneNo,
          gender,
          address,
          dateOfBirth,
          maritalStatus,
          religion,
          educationalQualification,
          nationality,
          languageSpoken,
          emergencyContact = {},
          officialDetails = {},
          bankDetails = {}
      } = req.body;

      const newUser = new User({
          firstName,
          lastName,
          middleName,
          email,
          phoneNo,
          gender,
          address,
          dateOfBirth,
          maritalStatus,
          religion,
          educationalQualification,
          nationality,
          languageSpoken,
          document: req.file ? req.file.path : '',

          emergencyContact: {
              name: emergencyContact.name || '',
              phoneNo: emergencyContact.phoneNo || '',
              relationship: emergencyContact.relationship || '',
              address: emergencyContact.address || '',
          },
          officialDetails: {
              employeeId: officialDetails.employeeId || '',
              jobTitle: officialDetails.jobTitle || '',
              department: officialDetails.department || '',
              email: officialDetails.email || '',
              phoneNo: officialDetails.phoneNo || '',
              reportingOfficer: officialDetails.reportingOfficer || '',
              workSchedule: officialDetails.workSchedule || '',
              employmentType: officialDetails.employmentType || '',
              region: officialDetails.region || '',
              basicSalary: officialDetails.basicSalary || 0,
              startingDate: officialDetails.startingDate || '',
              contractEndDate: officialDetails.contractEndDate || '',
              skills: officialDetails.skills || [],
          },
          bankDetails: {
              bankName: bankDetails.bankName || '',
              accountNumber: bankDetails.accountNumber || '',
              accountHolderName: bankDetails.accountHolderName || '',
              bicCode: bankDetails.bicCode || '',
          },
      });

      await newUser.save();
      res.status(200).json(newUser);
  } catch (error) {
      console.error("Error saving user:", error);
      console.error("Request Body:", req.body); // Log the request body for debugging
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

// search by Name
router.get("/employees/:firstName", async (req, res) => {
  const firstname = req.params.firstName;
  console.log(firstname);
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: firstname, $options: "i" } },
        { lastName: { $regex: firstname, $options: "i" } },
        { employeeId: { $regex: firstname, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// update a user

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    middle_name,
    email,
    phone_no,
    image,
    gender,
    employee_id,
    employment_type,
    address,
    Address,
    date_of_birth,
    marital_status,
    region,
    religion,
    educational_qualification,
    nationality,
    language_spoken,
    job_title,
    department,
    reporting_officer,
    work_schedule,
    bank_name,
    account_holder_name,
    account_number,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        middle_name,
        phone_no,
        email,
        phone,
        image,
        gender,
        employee_id,
        employment_type,
        address,
        Address,
        date_of_birth,
        marital_status,
        region,
        religion,
        educational_qualification,
        nationality,
        language_spoken,
        job_title,
        department,
        reporting_officer,
        work_schedule,
        bank_name,
        account_holder_name,
        account_number,
      },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// delete a user

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(user.cloudinary_id);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
