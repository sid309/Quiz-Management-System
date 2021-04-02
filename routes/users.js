const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//user model
const User=require('../config/model/User');
//for login page
router.get('/login',(req,res)=>res.render('login'));
//for register page
router.get('/register',(req,res)=>res.render('register'));
//register handle
router.post('/register',(req,res)=>{
    const{name,email,password,password1}=req.body;
    let errors=[];
    //checking the compulsary fields
    if(!name || !email || !password ||!password1){
        errors.push({msg:'Not filled the fields given in the form!'});
    }
    //matching of passwords
    if(password!==password1){
        errors.push({msg:"Passwords don't match"});
    }
    //checking the password length
    if(password.length<6){
        errors.push({msg:'password must have atleast 6 characters!'});
    }

    //decision
    if(errors.length>0){
        res.render('register',{
            errors,name,email,password,password1
        });
    }
    else{
        //passing of validation
        User.findOne({ email:email })
        .then(user=>{
            if(user){
                //existance of user
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,name,email,password,password1
                });
            }else{
                const newUser=new User({name:name,email:email,password:password});
                //Hashing Process
                bcrypt.genSalt(10,(err,salt)=>
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    //converting password to hash
                    newUser.password=hash;
                    //Saving the User
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg','You have successfully registered and can log in!');
                        res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
                }))
            }
        });
    }
})

//login handle
router.post('/login',async(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are Logged Out!');
    res.redirect('/users/login');
});

//quiz handle
router.get('/index',(req,res)=>res.render('index'));


module.exports=router;