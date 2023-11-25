const express=require("express");
const router=express.Router();

const userController=require("../controllers/userControllers");


router.post("/register",userController.register);






module.exports = router; // Export the router as a function