exports.getPrivateData=(req,res,next)=>{
    res.status(200).json({
        sucsess:true,
        data:"you got access to pruvate data"
    });
};

