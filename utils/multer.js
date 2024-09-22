const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists
const dir = './files';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now(); // More unique
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };


//  multer config

// module.exports = multer({
//     storage: multer.diskStorage({}),
//     fileFilter: (req,file,cb) => {
//         let ext = path.extname(file.originalname);
//         if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png"){
//             cb(new Error("File type is not supported"), false);
//             return;
//         }
//         cb(null, true);
//     }
// });