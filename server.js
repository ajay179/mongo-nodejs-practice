require('dotenv').config()
const express = require('express')
const routesList = require('./routes/routes')
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('express-flash')
const session = require('express-session')
var MongoDbStore = require('connect-mongo')



const app = express()
const PORT = process.env.PORT || 3000

const url = "mongodb+srv://AJAYPRAJAPATI:A%40a98936951@cluster0.8eb8rvw.mongodb.net/mongoNodejs"

//Database Connection
mongoose.connect(url).then(() =>{
    console.log('Database Connected!')
}).catch(()=>{
    console.log('Database is not connected');
 });


// set middleware for get json request && form data request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Session store
let mongoStore = new MongoDbStore({
    mongoUrl: url,
    collection :'sessions'

})
  
// set sesssion in express 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store:mongoStore,
    saveUninitialized: true,
     cookie:{maxAge:1000 * 60 * 60 * 24} // cookie life for 24 houre
  }))

  
//make global middleware for use session in view page
app.use((req,resp,next)=>{
    resp.locals.session = req.session;
    resp.locals.user = req.user
    next();
})

//set flash message module
app.use(flash());

//Set route list
routesList(app);

//set assets folder
app.use(express.static('public'))

//Set template engine (use ejs template engine)
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')



server = app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
});