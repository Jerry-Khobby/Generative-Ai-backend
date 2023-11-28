const express=require("express");
const router=express.Router();

const userController=require("../controllers/userControllers");


router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/homepage",userController.homepage);






module.exports = router; // Export the router as a function