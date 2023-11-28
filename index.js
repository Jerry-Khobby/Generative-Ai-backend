const express=require("express");

const app =express();
const bodyParser=require("body-parser");
const mongoose =require("mongoose");
const dotenv=require("dotenv").config();
const cors =require("cors");
const cookieParser = require('cookie-parser');
const userRoutes =require("./routes/userRoutes");



//Defining   how long the session must take 
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));

// using the body parser to I get items from the frontend to the backend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// connecting to my database server usin mongoose 
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

// Bind connection to open event
db.once('open', () => {
    console.log('Connected to MongoDB!');
  });
  
app.use(userRoutes);
































const PORT =process.env.PORT||5500;

app.listen(PORT,()=>{
    console.log(`The server is been listened successfully on port ${PORT}`);
})

//jerrymardeburg
//generative
