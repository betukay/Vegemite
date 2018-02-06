var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dhigr0dwd', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//INDEX - show all recipes
router.get("/", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Recipe.find({name: regex}, function(err, AllRecipes){
            if(err){
                console.log(err);
            } else {
                res.render("recipes/index", {recipes: AllRecipes});
            }
        });
    } else {
        Recipe.find({}, function(err, AllRecipes){
            if(err){
                console.log(err);
            } else {
                res.render("recipes/index", {recipes: AllRecipes});
            }
        });
    }
});


router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the recipe object under image property
      req.body.recipe.image = result.secure_url;
      // add author to recipe
      req.body.recipe.author = {
        id: req.user._id,
        username: req.user.username
      };
      Recipe.create(req.body.recipe, function(err, recipe) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/recipes/' + recipe.id);
      });
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;