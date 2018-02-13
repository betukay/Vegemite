require('dotenv').config();

var express        = require("express"),
    app            = express(),
    path           = require("path"),
    favicon        = require('serve-favicon'),
    bodyParser     = require("express"),
    moment         = require("moment"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Recipe         = require("./models/recipe"),
    Comment        = require("./models/comment"),
    User           = require("./models/user")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    recipeRoutes     = require("./routes/recipes"),
    indexRoutes      = require("./routes/index")
   
   
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/vegemite");
app.use(express.static(__dirname + "/public"));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = moment;
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"almost there",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user; 
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

console.log("process.env.DATABASEURL");

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Vegemite has started...");
});