var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
//middleware
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You should be logged in...");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect("back");
            }else{
                //If yes check if the user owns the campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{  //otherwise, redirect
                    req.flash("error", "You don't have permission to do that..");
                    res.redirect("back");
                }
                
            }
        });
        
    }else{      // otherwise redirect
        req.flash("error", "You must be logged in..");
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
     if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found..");
                res.redirect("back");
            }else{
                //If yes check if the user owns the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{  //otherwise, redirect
                    req.flash("error", "This is not a campground you created, You do not have permission.. ");
                    res.redirect("back");
                }
                
            }
        });
        
    }else{      // otherwise redirect
        req.flash("error", "You must be logged in..");
        res.redirect("back");
    }
}



module.exports= middlewareObj; 