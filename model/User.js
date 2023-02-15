const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
        select:false,
        minlength:6
    },
    resetPasswordToket:String,
    resetPasswordExpire: Date
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});

userSchema.methods.matchPassword= async function(password){
    return(
        await bcrypt.compare(password,this.password));
}

userSchema.methods.getSignedToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_KEY,{expiresIn:process.env.JWT_EXPIRE})
}

userSchema.methods.getResetPasswordToken=async function(){
    const resetToken=crypto.randomBytes(20).toString('hex');

    this.resetPasswordToket=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now() + 10*(60*1000);

    return resetToken;
}

const User=mongoose.model("AuthData",userSchema);

module.exports=User;