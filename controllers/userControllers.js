const bcrypt=require('bcrypt');

const User =require("../models/schema");
const dotenv=require("dotenv").config();
const jwt =require("jsonwebtoken");

const JWT_SECRET= process.env.JWT_SECRET

const register =async(req,res)=>{
    const {firstname,lastname,email,password}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            console.log("This user already exists");
            return res.status(409).json({error:"Email address is already in use"});
        }
        const newHashed =await bcrypt.hash(password,10);
        // create a new following the password 
        const newUser=new User({
            firstname,
            lastname,
            email,
            passwords: newHashed,
        });
        console.log("The new user created:",newUser);
        await newUser.save();

        // now the user is created , let me add the jwt
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
        if (err) throw err;
     // Respond with the token and any additional user information you want to include
     res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
        id: newUser._id,
      });
     res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          userId: newUser._id,
          email: newUser.email,
          // Include other user information as needed
        },
      });
    }catch(e){
        if (err) throw err;
        res.status(500).json('error');
    
    }
}



module.exports={
    register,
}