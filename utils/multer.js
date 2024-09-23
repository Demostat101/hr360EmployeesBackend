const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require('express');
const app = express();

// Increase limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));




// Ensure the directory exists
const dir = './files';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files');
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
                if (ext !== ".pdf"){
                   return cb (new Error("File type is not supported"));
                    
                
                }
        cb(null, file.originalname);
    },
});


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A multer error occurred when uploading.
        return res.status(400).json({ error: err.message });
    } else if (err.message.includes('request entity too large')) {
        // Body size limit exceeded.
        return res.status(413).json({ error: 'Payload too large' });
    }
    next(err);
});



const upload = multer({ storage: storage, 
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit for file uploads
});

module.exports = { upload };