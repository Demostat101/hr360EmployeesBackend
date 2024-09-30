const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const routes = require("./routes");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 3500;
const app = express();



const allowedOrigins = [
  'http://localhost:5173',
  'https://hr360dashboard-omikunle-ademola.netlify.app',
];
const corsOptions = {
  origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'OPTIONS',"PATCH","DELETE"], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
  credentials: true, // If you need to include credentials
};

// Use CORS middleware
app.use(cors(corsOptions));

// Handle OPTIONS method for preflight requests
app.options('*', cors(corsOptions)); // Enable preflight across all routes


// app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  // console.log("Request Size:", JSON.stringify(req.body).length);
  next();
});

// File upload middleware
app.use("/files", express.static("file"));
app.use("/user", routes);
// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message.includes("request entity too large")) {
    return res.status(413).json({ error: "Payload too large" });
  }
  next(err);
});

//route
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
