var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");


//INDEX - show all restaurants
router.get("/", function(req, res){
    Restaurant.find({}, function(err, AllRestaurants){
        if(err){
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants: AllRestaurants});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   var name   = req.body.name; 
   var price  = req.body.price;
   var image  = req.body.image;
   var desc   = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newRestaurant = {name: name, price: price, image: image, description: desc, author: author};
   //CREATE - add new restaurant to DB
   Restaurant.create(newRestaurant, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
           console.log(newlyCreated);
           res.redirect("/restaurants");
       }
   });
});

//NEW - show form to create new restaurant
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("restaurants/new");
});

// SHOW - displays info on particular restaurant
router.get("/:id", function(req, res){
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err || !foundRestaurant){
            req.flash("error", "Restaurant not found.");
            res.redirect("back");
        } else {
            console.log(foundRestaurant);
                res.render("restaurants/show", {restaurant: foundRestaurant});
        }
    });
});

//EDIT Restaurant Route
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
            res.render("restaurants/edit", {restaurant: foundRestaurant});          
        });
});

//UPDATE Restaurant Route
router.put("/:id/", middleware.checkRestaurantOwnership, function(req, res){
    //find and update restaurant
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});

//DESTROY restaurant route
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res){
   Restaurant.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/restaurants");
      } else {
          res.redirect("/restaurants");
      }
   });
});


module.exports = router;