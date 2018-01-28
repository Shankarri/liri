var fs = require('fs'); 
var request = require('request');
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.Twitter);

console.log("running!");

// Grabs the command from the terminal
var command = process.argv[2];
var searchValue = "";

// Puts together the search value into one string
for (var i = 3; i < process.argv.length; i++) {
    //This is not working correctly, there is a + in the end
    searchValue += process.argv[i] + "+";
};

//Puts a + in between the words
//This is not working 
// searchValue = searchValue.split("+");

console.log("Search Value is: " + searchValue);

// ++++++++++++ Twitter ++++++++++++++++++++++
var getTweets = function() {
    var client = new Twitter(keys.twitter);
    var params = {screen_name: 'aidan_clemente', count: 20};
    client.get('statuses/user_timeline', params, function(responseError, tweets, response) {
        if (!responseError) {

            var tweetsArray = [];

            //Populates array with tweets and when tweets were created
            for (var i = 0; i < tweets.length; i++) {
                tweetsArray.push({
                    "Created at: ": tweets[i].created_at,
                    "Tweet: ": tweets[i].text,
                }); 

                //Prints the array to console
                for (var key in tweetsArray[i]){
                    console.log("--------------")
                    console.log(key + tweetsArray[i][key]);  
                };   
            };
        }
    });
};

//Move this down to the bottom
switch (command) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomText();
        break;
}

// ++++++++++++++++++ Spotify ++++++++++++++++++++++++++++
// var searchSong = function(searchValue) {
    spotify.search({ type: "track", query: "searchValue" }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
    
    console.log(data); 
    });
// };
