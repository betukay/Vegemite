var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
//all the middleware
var middlewareObj ={};

middlewareObj.checkRestaurantOwnership = function(req, res, next){
     //is user logged in
    if(req.isAuthenticated()){
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
           if(err || !foundRestaurant){
               req.flash("error", "Restaurant not found.")
               res.redirect("back");
           } else {
                //does user own campground
                if(foundRestaurant.author.id.equals(req.user._id)){
                    next();          
                } else {
                    req.flash("error", "User permission denied.")
                    res.redirect("back");   
                }
           }
        });
    } else {
        req.flash("error", "A valid login is required.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
     //is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found.");
               res.redirect("back");
           } else {
                //does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();          
                } else {
                    req.flash("error", "User permission denied.")
                    res.redirect("back");   
                }
           }
        });
    } else {
        req.flash("error", "Please log in to proceed.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login.");
    res.redirect("/login");
};

module.exports = middlewareObj;