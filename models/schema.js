const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    last_name:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//Export the model
const User = mongoose.model('User', userSchema);

// Export the User model to be used in other parts of your application
module.exports=User;

