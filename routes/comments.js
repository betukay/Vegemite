var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {restaurant: restaurant});
       }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
   Restaurant.findById(req.params.id, function(err, restaurant){
       if(err){
           console.log(err);
           res.redirect("/restaurants");
       } else {
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  restaurant.comments.push(comment._id);
                  restaurant.save();
                  console.log(comment);
                  req.flash("success", "New comment has been successfully added.")
                  res.redirect('/restaurants/'+ restaurant._id);
              }
          });
       }
   });
});

//Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
            if(err || !foundRestaurant){
                req.flash("error", "No restaurant found.");
                return res.redirect("back");
            }
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
                }
            });
        })
});

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/restaurants/" + req.params.id);
      }
   });
});

//Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});


module.exports = router;