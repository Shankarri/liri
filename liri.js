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

// ++++++++++++ Twitter ++++++++++++++++++++++
var getTweets = function() {
    var client = new Twitter(keys.twitter);
    var params = {screen_name: 'aidan_clemente', count: 20};
    client.get('statuses/user_timeline', params, function(responseError, tweets, response) {
        if (!responseError) {
            // console.log(tweets);
            var tweetsArray = [];

            for (var i = 0; i < tweets.length; i++) {
                tweetsArray.push({
                    "Created at: ": tweets[i].created_at,
                    "Tweets: ": tweets[i].text,
                }); 
                
                // for (var j = 0; j < tweets.length; j++){
                //     console.log(Object.keys(tweetsArray)[j]);
                //     console.log(Object.values(tweetsArray)[j]);
                // }
                
                
            }

           console.log(tweetsArray) 
        }
    });
};

if (command == "my-tweets") {
    getTweets();
}

// ++++++++++++++++++ Spotify ++++++++++++++++++++++++++++

spotify.search({ type: "track", query: "songName" }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(data); 
});