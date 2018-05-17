
var express= require("express");
var router= express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});

//============================
// AUTH ROUTES
//============================

//Show the register form
router.get("/register", function(req, res) {
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcaome to YelpCamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    res.send("posting...");
});
//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out..");
    res.redirect("/campgrounds");
});



module.exports = router;