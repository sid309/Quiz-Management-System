const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

// loading user model
const User=require('../config/model/User');

module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email' },(email,password,done)=>{
            //matching of user in database
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'that email is not registered'});
                }
            //matching of password
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message:"The password doesn't match"});
                }
            });

            })
            .catch(err=>console.log(err));
        })
    );

    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}