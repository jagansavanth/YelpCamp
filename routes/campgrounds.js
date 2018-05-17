var express= require("express");
var router= express.Router();
var Campground= require("../models/campgrounds");
var middleware = require("../middleware");


// INDEX - shows all the campgrounds
router.get("/", function(req, res){
   // retrieve all the campgrounds from the database
   Campground.find({}, function(error, allCampgrounds){
      if(error){
          console.log("error occured");
      } else{
          res.render("campgrounds/index", {campgrounds: allCampgrounds});
      }
   });
   
});

// NEW - shows form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// CREATE - adds a new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    
    // get data from form template and add data to campgrounds array 
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author= {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, image: image, price: price, description: desc, author: author};
    
    //create a new Campground and save it to a DB
    Campground.create(newCampground, function(error, newcampground){
        if(error){
            console.log("Error Occured");
        }
        else{
            console.log("New Campground created and added to DB");
            
        }
    });
    
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

//SHOW - shows more info about a selected campground
router.get("/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if(error){
            console.log(error);
        }else{
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
            
        }
    });
    
    
});

//EDIT Campgorund Route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            }else{
                    res.render("campgrounds/edit", {campground: foundCampground});
            }
        });
});

//UPDATE Campground Route

router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/campgrounds/' + updatedCampground._id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;