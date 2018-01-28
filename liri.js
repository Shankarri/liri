var fs = require('fs'); 
var request = require('request');
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.Twitter);

// Grabs the command from the terminal
var command = process.argv[2];
var searchValue = "";

// Puts together the search value into one string
for (var i = 3; i < process.argv.length; i++) {
    //This is not working correctly, there is a + in the end
    searchValue += process.argv[i] + " ";
};

//Puts a + in between the words
//This is not working 
// searchValue = searchValue.split("+");

console.log("Search Value is: " + searchValue);

// ++++++++++++ Twitter ++++++++++++++++++++++
function getTweets() {
    var client = new Twitter(keys.twitter);
    var params = {screen_name: 'aidan_clemente', count: 20};
    client.get('statuses/user_timeline', params, function(responseError, tweets, response) {
        if (!responseError) {

            var tweetsArray = [];

            //Populates array with tweets and when tweets were created
            for (var i = 0; i < tweets.length; i++) {
                tweetsArray.push({
                    "Tweet: ": tweets[i].text,
                    "Created at: ": tweets[i].created_at,
                }); 

                //Prints the array contents to console
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
// function searchSong(searchValue) {

//     console.log("searchSong is running!")
    // spotify
    // .search({ type: 'track', query: searchValue })
    // .then(function(response) {
    //   console.log(response);
    // })
    // .catch(function(err) {
    //   console.log(err);
    // });

//     spotify
//     request("https://api.spotify.com/v1/search?q=" + searchValue + "&/tracks/7yCPwWs66K8Ba5lFuU2bcx", function(spotifyError, response, body) {
//     .then(function(response) {
//         console.log(response); 
//         })
//         .catch(function(spotifyErrorerr) {
//         console.error('Error occurred: ' + spotifyError); 
//         });

//     }
    
// };

// ++++++++++++ OMDB +++++++++++++++++++++++
function searchMovie(searchValue) {

    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    console.log("search Value: ", searchValue);

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function(err, response, body) {

        if (!err && response.statusCode === 200) {
            movieBody = JSON.parse(body);
            
            console.log(movieBody);
            console.log("\n-------------------------------");
            console.log("The movie title is: " + movieBody.Title);
            console.log("The movie year is: " + movieBody.Year);
            console.log("The movie IMDB rating is: " + movieBody.imdbRating);
            if (movieBody.Ratings.length < 2){
                console.log("There is no Rotten Tomatoes Rating for this movie.")
            } else {
                console.log("The movie Rotten Tomatoes Rating is: " + movieBody.Ratings[[1]].Value);
            }
            
            console.log("The country where the movie was produced is: " + movieBody.Country);
            console.log("The language of the movie is: " + movieBody.Language);
            console.log("The plot of the movie is: " + movieBody.Plot);
            console.log("The actors in the movie are: " + movieBody.Actors);
            console.log("\n-------------------------------");
        }
    });

}