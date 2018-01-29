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

// Error Functions 
function errorFunction(respError) {
    if (respError) {
        return console.log("Error occured: ", respError);
     }
};

// For logging to log.txt
function errorFunctionStart (respError) {
    errorFunction();
    console.log("\nxxxx Log Started xxxx");

};

function errorFunctionEnd (respError) {
    errorFunction();
    console.log("xxxx Log Ended xxxx");
};

// -------------------- Twitter my-tweets ----------------------------
function getTweets() {
    // Accesses Twitter Keys
    var client = new Twitter(keys.twitter); 
    var params = {
        screen_name: 'aidan_clemente',
        count: 20
        };

    client.get('statuses/user_timeline', params, function(respError, tweets, response) {

        errorFunction();

        fs.appendFile("log.txt", "-----Tweets Log Entry Start-----\n\nProcessed at: \n" + Date() + "\n\n" + "terminal commands: \n" + process.argv + "\n\n" + "Data Output: \n", errorFunctionStart());

        console.log("\n-------------- Aidan's Latest Tweets --------------\n");
        for (i = 0; i < tweets.length; i++) {
            console.log(i + 1 + ". Tweet: ", tweets[i].text);

            // For alingment once the number of the tweet is 10 or higher
            if (i + 1 > 9) {
                console.log("    Tweeted on: ", tweets[i].created_at + "\n");
            } else {
                console.log("   Tweeted on: ", tweets[i].created_at + "\n");
            }  
            
            fs.appendFile("log.txt", (i + 1 + ". Tweet: ", tweets[i].text + "\nTweeted on: " + tweets[i].created_at + "\n\n"), errorFunction());
        };
        console.log("--------------------------------------------------\n");

        fs.appendFile("log.txt", "-----Tweets Log Entry End-----\n\n", errorFunctionEnd());
    });
};

// ======================= Spotify spotify-this-song ============================
function searchSong(searchValue) {

    if (searchValue == "") {
        searchValue = "The Sign Ace of Base";
    }

    // Accesses Spotify keys  
    var spotify = new Spotify(keys.spotify);
   
    spotify.search({ type: 'track', query: searchValue }, function(respError, response) {

        fs.appendFile("log.txt", "-----Spotify Log Entry Start-----\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n", errorFunctionStart());

        errorFunction()

         var songResp = response.tracks.items;

         console.log("\n=============== Spotify Search Result ===============\n");
         console.log(("Artist: " + songResp[0].artists[0].name));
         console.log(("Song title: " + response.tracks.items[0].name));
         console.log(("Album name: " + songResp[0].album.name));
         console.log(("URL Preview: " + songResp[0].preview_url));
         console.log("\n=====================================================\n");

         fs.appendFile("log.txt", "Artist: " + songResp[0].artists[0].name + "\nSong title: " + response.tracks.items[0].name + "\nAlbum name: " + songResp[0].album.name + "\nURL Preview: " + songResp[0].preview_url + "\n\n-----Spotify Log Entry End-----\n\n", errorFunctionEnd());
     })
};

// ++++++++++++++++ OMDB movie-this +++++++++++++++++++++++
function searchMovie(searchValue) {

    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(respError, response, body) {

        fs.appendFile("log.txt", "-----OMDB Log Entry Start-----\n\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n", errorFunctionStart());

        errorFunction()

        if (!respError && response.statusCode === 200) {
            movieBody = JSON.parse(body);
            
            console.log("\n++++++++++++++++ OMDB Search Results ++++++++++++++++\n");
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
            console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++\n");

            fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value + "\nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorFunctionEnd());
        }
    });
};

// xxxxxxxxxxxxxxxxxxxxxxxxxxx Random do-what-it-says xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function randomSearch() {

    fs.readFile("random.txt", "utf8", function(respError, data) {

        var randomArray = data.split(", ");

        if (respError) {
            return console.log(respError);
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
    default:
        console.log("I'm sorry, " + command + " is not a command that I recognize. Please try one of the following commands: \n\n  1. For a random search: node liri.js do-what-it-says \n\n  2. To search a movie title: node liri.js movie-this (with a movie title following) \n\n  3. To search Spotify for a song: node liri.js spotify-this-song (with a song title following) \n\n  4. To see the last 20 of Aidan Clemente's tweets on Twitter: node liri.js my-tweets \n");
};
