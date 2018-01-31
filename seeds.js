var mongoose   = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment    = require("./models/comment");

var data = [
    {
    name: "State of Soup", 
    image: "https://images.unsplash.com/photo-1504855328839-2f4baf9e0fd7?auto=format&fit=crop&w=391&q=80",
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio."
    },
    {
    name: "Carrot City", 
    image: "https://images.unsplash.com/photo-1504855328839-2f4baf9e0fd7?auto=format&fit=crop&w=391&q=80",
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio."    
    },
    {
    name: "Berry Full", 
    image: "https://images.unsplash.com/photo-1504855328839-2f4baf9e0fd7?auto=format&fit=crop&w=391&q=80",
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio."
    }
]

function seedDB(){
    //remove all restaurants
    Restaurant.remove({}, function(err){
            // if(err){
            //     console.log(err);
            // } else 
            //     console.log("removed restaurants!");     
            //     //add a few restaurants
            //     data.forEach(function(seed){
            //     Restaurant.create(seed, function(err, restaurant){
            //         if(err){
            //             console.log(err)
            //         } else {
            //             console.log("added a restaurant");
            //             //create comment
            //             Comment.create(
            //                 {
            //                   text: "The food is top notch!",
            //                   author: "Carl"
            //                 }, function(err, comment){
            //                     if(err){
            //                         console.log("err");
            //                     } else {
            //                         restaurant.comments.push(comment._id);
            //                         restaurant.save();
            //                         console.log("Created new comment");
            //                     }
            //                 });
            //         }
            //         });
            //     });
    });
}

module.exports = seedDB;