const express=require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

const app=express();

//passport config
require('./config/passport')(passport);

//database configuration
const db=require('./config/keys').MongoURI;

//connection to mongodb
mongoose.connect(db,{useNewUrlParser:true}).then(()=>console.log('Database Connected!'))
.catch(err=>console.log(err));

//for ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//Body-Parser
app.use(express.urlencoded({extended:false}));

//express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true   
}));

//passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

//connection of flash
app.use(flash());

//global variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT=process.env.PORT || 3000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));
