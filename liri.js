var fs = require('fs'); 
var request = require('request');
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');

// AccessesSpotify keys
var spotify = new Spotify(keys.spotify);

// Grabs the command from the terminal
var command = process.argv[2];
var searchValue = "";

// Puts together the search value into one string
for (var i = 3; i < process.argv.length; i++) {
    //This is not working correctly, there is a + in the end
    searchValue += process.argv[i] + " ";
};

//Move this down to the bottom or do I put this in a document on load?
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
};

// ++++++++++++++++ Twitter my-tweets ++++++++++++++++++++++
function getTweets() {
    
    var client = new Twitter(keys.twitter); // Accesses Twitter Keys
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

// ++++++++++++++++ OMDB movie-this +++++++++++++++++++++++
function searchMovie(searchValue) {

    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

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
};

//+++++++++++++++++ Random do-what-it-says +++++++++++++++++++++++++
function randomText() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
            return console.log(error);
        }

        var randomArray = data.split(", ");
        console.log(randomArray);

        if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } else {
            getTweets();
        }
        
    });
};