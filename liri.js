var fs = require('fs'); 
var request = require('request');
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');

// Grabs the command from the terminal
var command = process.argv[2];
var searchValue = "";

// Puts together the search value into one string
for (var i = 3; i < process.argv.length; i++) {
    searchValue += process.argv[i] + " ";
};

// Need a write function to fs.appendFile 

// ++++++++++++++++ Twitter my-tweets ++++++++++++++++++++++
function getTweets() {
    // Accesses Twitter Keys
    var client = new Twitter(keys.twitter); 
    var params = {screen_name: 'aidan_clemente', count: 20};

    client.get('statuses/user_timeline', params, function(responseError, tweets, response) {
        if (!responseError) {

            var tweetsArray = [];

            fs.appendFile("log.txt", "-----Tweets Log Entry Start-----\n" + Date() + "\n" + "terminal commands: \n" + process.argv + "\n" + "Data Output: \n", function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Tweet Log Started!");
                }
             });

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
                    
                    //The Log isn't working correctly, tweets out of order
                    fs.appendFile("log.txt", "\n-----Tweets-----\n" + key + tweetsArray[i][key], function(err) {
                        if (err) {
                        console.log(err);
                        } else {
                        console.log("Tweets Added!");
                        }
                    });  
                }; 
            };

            fs.appendFile("log.txt", "\n-----Tweets Log Entry End-----\n", function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Tweet Log Ended!");
                  }
            });
        }
    });
};

// ++++++++++++++++++ Spotify spotify-this-song ++++++++++++++++++++++++++++
function searchSong(searchValue) {

    if (searchValue == "") {
        searchValue = "The Sign Ace of Base";
    }

    // Accesses Spotify keys  
    var spotify = new Spotify(keys.spotify);
   
    spotify.search({ type: 'track', query: searchValue }, function(respError, response) {

         if (respError) {
            return console.log("Error occured: ", respError);
         }

         var songResp = response.tracks.items;

         console.log("\n----------- Spotify Search Result ------------------\n");
         console.log(("Artist: " + songResp[0].artists[0].name));
         console.log(("Song title: " + response.tracks.items[0].name));
         console.log(("Album name: " + songResp[0].album.name));
         console.log(("URL Preview: " + songResp[0].preview_url));
         console.log("\n------------------------------------------------------\n");
         
     })
};

// ++++++++++++++++ OMDB movie-this +++++++++++++++++++++++
function searchMovie(searchValue) {

    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(err, response, body) {

        if (!err && response.statusCode === 200) {
            movieBody = JSON.parse(body);
            
            console.log("\n------------- OMDB Search Results ------------------\n");
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

            if (movieBody.Ratings.length < 2) {
                console.log("There is no Rotten Tomatoes Rating for this movie.")
            } else {
                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);
            }
            
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
            console.log("\n----------------------------------------------------\n");
        }
    });
};

//+++++++++++++++++ Random do-what-it-says +++++++++++++++++++++++++
function randomSearch() {

    fs.readFile("random.txt", "utf8", function(error, data) {

        var randomArray = data.split(", ");

        if (error) {
            return console.log(error);
        } else if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } else {
            getTweets();
        }
        
    });
};

// Runs corresponding search based on user command
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
        randomSearch();
        break;
};

//------------- If the user enters an undefinded command ---------------------------
var unknown = "";

for (var i = 2; i < process.argv.length; i++) {
    unknown += process.argv[i] + " ";
};

if (searchValue != "do-what-it-says" || "movie-this" || "spotify-this-song" || "my-tweets") {
    console.log("I'm sorry, " + unknown + " is not a command that I recognize. Please try one of the following commands: \n For a random search: node liri.js do-what-it-says \n To search a movie title: node liri.js movie-this (with a movie title following) \n To search Spotify for a song: node liri.js spotify-this-song (with a song title following) \n To see the last 20 of Aidan Clemente's tweets on Twitter: node liri.js my-tweets \n");
}
