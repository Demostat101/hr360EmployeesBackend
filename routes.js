const express = require("express");
const User = require("./user");
const router = express.Router();
const cloudinary = require("./utils/cloudinary");
// const upload = require("./utils/multer");

//  insert image

// router.post("/", upload.single("image"), async(req, res)=>{
//     const result = await cloudinary.uploader.upload(req.file.path);
//     try {
//         res.json(result)
//     } catch (error) {
//         console.log(error);
//     }
// })

// insert a user into database route
// const result = await cloudinary.uploader.upload(req.file.path);

router.post('/employee', async (req, res) => {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            gender: req.body.gender,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth,
            maritalStatus: req.body.maritalStatus,
            religion: req.body.religion,
            educationalQualification: req.body.educationalQualification,
            nationality: req.body.nationality,
            languageSpoken: req.body.languageSpoken,
            document: req.body.document,
            emergencyContact: {
                name: req.body.emergencyContact.name,
                phoneNo: req.body.emergencyContact.phoneNo,
                relationship: req.body.emergencyContact.relationship,
                address: req.body.emergencyContact.address,
            },
            officialDetails: {
                employeeId: req.body.officialDetails.employeeId,
                jobTitle: req.body.officialDetails.jobTitle,
                department: req.body.officialDetails.department,
                email: req.body.officialDetails.email,
                phoneNo: req.body.officialDetails.phoneNo,
                reportingOfficer: req.body.officialDetails.reportingOfficer,
                workSchedule: req.body.officialDetails.workSchedule,
                employmentType: req.body.officialDetails.employmentType,
                region: req.body.officialDetails.region,
                basicSalary: req.body.officialDetails.basicSalary,
                startingDate: req.body.officialDetails.startingDate,
                contractEndDate: req.body.officialDetails.contractEndDate,
                skills: req.body.officialDetails.skills,
            },
            bankDetails: {
                bankName: req.body.bankDetails.bankName,
                accountNumber: req.body.bankDetails.accountNumber,
                accountHolderName: req.body.bankDetails.accountHolderName,
                bicCode: req.body.bankDetails.bicCode,
            },
        });

        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
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
