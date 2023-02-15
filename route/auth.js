const express=require('express');
const { register, login, forgetPassword, resetPassword, users } = require('../controller/auth');
const router=express.Router();

router.route('/users').get(users);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgotpassword').post(forgetPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);

module.exports=router;
