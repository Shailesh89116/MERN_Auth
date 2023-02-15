const User=require('../model/User');
const ErrorResponse=require("../utils/errorResponse");
const sendEmail = require('../utils/sendEmail');
const crypto=require('crypto')


exports.users=async(req,res,next)=>{
    const users=await User.find({});

    res.send(users);
}


exports.register=async(req,res,next)=>{
    const {username,email,password}=req.body;
    const userExists=await User.findOne({username,email});
    if(userExists){
        res.send("Already registered user ");
    }

    try {
        const user=await User.create({username,email,password});
        // res.status(200).json({
        //     success:true,
        //     user
        // });
        sendToken(user,201,res);
    } catch (error) {
        console.log(error)
    }
};

exports.login=async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(new ErrorResponse("Please provide Email or Password",400));
    }

    try {
        const userExist=await User.findOne({email}).select("+password");
        if(!userExist){
            return next(new ErrorResponse("Invalid Credentials Email",404));
        }

        const isMatch=await userExist.matchPassword(password);
        if(!isMatch){
            return next(new ErrorResponse("Invalid Credentials Password",401));
        }
        sendToken(userExist,200,res);
        res.send("Logged In")
    } catch (error) {
        console.log(error);
    }
    
};

exports.forgetPassword=async(req,res,next)=>{
    const {email}=req.body

    try {
        const user=await User.findOne({email});
        if(!user){
            return next(new ErrorResponse("Something went wrong",404));
        }

        const resetToken=await user.getResetPasswordToken();
        console.log(resetToken);
        await user.save();
        const resetURL=`http://localhost:3000/passwordReset/${resetToken}`;

        const message=`
        <h1>You have request a password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetURL} clicktracking=off>${resetURL}</a>`

        try {
            sendEmail({
                to:user.email,
                subject:"Password Reset Request",
                text:message
            });

            res.status(200).json({success:true,data:"Email Sent",token:resetToken})
        } catch (error) {
            console.log(error);
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;

            await user.save();

            return next(new ErrorResponse("Email could not send",500))
            
        }

    } catch (error) {
        next(error)
    }
};

exports.resetPassword=async(req,res,next)=>{
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Updated Success",
      token: user.getSignedToken(),
    });
  } catch (err) {
    next(err);
  }
};

const sendToken=(user,statusCode,res)=>{
    const token=user.getSignedToken();
    const loggedUser={
        _id: user._id,
        username: user.username,
        email: user.email,
        token:token
    }
    res.status(statusCode).json({success:true,token,loggedUser})
}