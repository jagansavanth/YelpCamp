var express = require("express"),
    app = express(),
     bodyParser = require("body-parser"),
     mongoose = require("mongoose"),
     flash = require("connect-flash"),
     seedDB = require("./seeds"),
     passport = require("passport"),
     methodOverride = require("method-override"),
     localStrategy = require("passport-local");
     
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
     
//seedDB();

var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var User = require("./models/user");

app.use(require("express-session")({
    secret: "This is the secret statement",
    resave: false,
    saveUninitialized: false
}));

app.use(methodOverride("_method"));

app.use(flash());

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

console.log(process.env.DATABASEURL);
    
mongoose.connect(process.env.DATABASEURL);

// mongoose.connect("mongodb://jagan:password@ds113775.mlab.com:13775/yelpcampjagan");


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname +"/public"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success"); 
    next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log(" The YelpCamp Server has started ");
});