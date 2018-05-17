
var express= require("express");
var router= express.Router({mergeParams: true});
var Campground= require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//===================== COMMENTS ROUTES =======================// 
//comment new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id 
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            
             // send that campground to new comment form template
            res.render("comments/new", {campground: foundCampground});
        }
    });
   
});

router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup the campground using id
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "something went wrong");
                   console.log(err);
               }else{
                   // add username and id to the comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   // connect new comment to the campgound
                   foundCampground.comments.push(comment);
                   foundCampground.save();  // saving the changes to the DB
                    // redirect to that show campground
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/' + foundCampground._id);
               }
            });
            
           
        }
    });
    
});

// EDIT Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            
        }
    });
});

//UPDATE Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//COMMENT Destroy Route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            req.flash("success", "Successfully deleted the comment..");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});




module.exports = router;