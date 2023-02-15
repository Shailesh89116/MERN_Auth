const jwt=require('jsonwebtoken');
const User=require('../model/User');
const ErrorResponse=require('../utils/errorResponse')
exports.protect=async(req,res,next)=>{
    let token;

    if(req.headers.authorization ){
        token=req.headers.authorization.split(' ')[1]
    }
    console.log(req.headers.authorization.startsWith("bearer"));

    if(!token){
        return next(new ErrorResponse("Not Authorized to access this route",401))
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_KEY);

        const user=await User.findById(decoded.id);
        if(!user){
            return next(new ErrorResponse("No user found with this id",404))
        }

        req.user=user;
        next();
    } catch (error) {
        return next(new ErrorResponse("not authorized to access",404))
    }
}