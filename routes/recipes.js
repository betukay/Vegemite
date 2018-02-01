var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var middleware = require("../middleware");


//INDEX - show all recipes
router.get("/", function(req, res){
    Recipe.find({}, function(err, AllRecipes){
        if(err){
            console.log(err);
        } else {
            res.render("recipes/index", {recipes: AllRecipes});
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
   var newRecipe = {name: name, price: price, image: image, description: desc, author: author};
   //CREATE - add new recipe to DB
   Recipe.create(newRecipe, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
           console.log(newlyCreated);
           res.redirect("/recipes");
       }
   });
});

//NEW - show form to create new recipe
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("recipes/new");
});

// SHOW - displays info on particular recipe
router.get("/:id", function(req, res){
    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
        if(err || !foundRecipe){
            req.flash("error", "Recipe not found.");
            res.redirect("back");
        } else {
            console.log(foundRecipe);
                res.render("recipes/show", {recipe: foundRecipe});
        }
    });
});

//EDIT recipe route
router.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res){
        Recipe.findById(req.params.id, function(err, foundRecipe){
            res.render("recipes/edit", {recipe: foundRecipe});          
        });
});

//UPDATE recipe route
router.put("/:id/", middleware.checkRecipeOwnership, function(req, res){
    //find and update recipe
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
        if(err){
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

//DESTROY recipe route
router.delete("/:id", middleware.checkRecipeOwnership, function(req, res){
   Recipe.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/recipes");
      } else {
          res.redirect("/recipes");
      }
   });
});


module.exports = router;