const {Schema} = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: new Date(),
    },
});

// userSchema.pre("save",async()=>{
//     console.log("Password before hashing:",password); // 👈 DEBUG LINE
//     password = await bcrypt.hash(password, 12);
//     next();
// });



module.exports = {userSchema};