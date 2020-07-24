var clientId = 'e385e97bbf0c45b2a800391010d7d594';
var clientSecret = '574cc1ada15544f78f9964403b0bd9be';
var gifImage = $("#currentGif");
var moodsArr = ["happy", "sad", "energetic", "aggressive", "relaxed", "sleepy", "classy", "indifferent"];

// Main function
function GetSelectedTextValue() {
    var selectedText = $("#moodDropdown option:selected").text();
    var selectedValue = $("#moodDropdown option:selected").val();
    tokenFunction();

    // POST request to spotify asking for an access token
    async function tokenFunction() {
        var result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        var data = await result.json();
        var accessToken = data.access_token;
        getPlaylist(accessToken);
    };

    // GET request to spotify sending my access token and asking for a playlist
    function getPlaylist(accessToken) {
        queryURL = "https://api.spotify.com/v1/playlists/" + selectedValue + "/tracks?offset=0&limit=15";
        $.ajax({
            url: queryURL,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (data) {
                populateSonglist(data, selectedValue);
            }
        });
    }

    function populateSonglist(data, selectedValue) {

        $("#playlistName").text(selectedText.charAt(0).toUpperCase() + selectedText.slice(1));
        $("#spotLink").attr("href", "https://open.spotify.com/playlist/" + selectedValue);
        $("#spotLink").text("Listen Now On Spotify!");

        var songList = $("#songList")
        songList.empty();

        for (var i = 0; i < data.items.length; i++) {
            var trackInfo = $("<tr>");

            var songName = $("<td>");
            songName.text(data.items[i].track.name);
            trackInfo.append(songName);

            var songArtist = $("<td>");
            songArtist.text(data.items[i].track.artists[0].name);
            trackInfo.append(songArtist);

            var songAlbum = $("<td>");
            var albumImg = $("<img>");
            // console.log(data.items[i].track.album.images)
            if (data.items[i].track.album.images[1]) {
                albumImg.attr("src", data.items[i].track.album.images[1].url)

            } else {
                albumImg.attr("src", "https://placehold.it/550x550")
            }

            songAlbum.append(albumImg);
            trackInfo.append(songAlbum);
            songList.append(trackInfo);
        }
        grabGif();
    }

    function grabGif() {

        if (selectedText === "Songs Worth Checking Out") {
            gifImage.attr("src", "https://media.giphy.com/media/5e3321JmUk848/giphy.gif");
        } else {
            var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=GLdAzfFBGkrBeUPV1mQCwztiE7bDfyV5&tag=" + selectedText;

            // Perfoming an AJAX GET request to our queryURL
            $.ajax({
                url: queryURL,
                method: "GET"
            })

                // After the data from the AJAX request comes back
                .then(function (response) {

                    // Saving the image_original_url property
                    var imageUrl = response.data.image_original_url;

                    // Setting the gifImage src attribute to imageUrl
                    gifImage.attr("src", imageUrl);
                });
        }
    }

    function listenForSpeech() {
        var speechRecognition = window.webkitSpeechRecognition;
        var recognition = new speechRecognition();

        $(".micBtn").click(function (event) {
            recognition.start();
        })

        //   indicate somehow that it is recording
        // maybe change the button when clicked
        recognition.onstart = function () {
            $(".micBtn").val("Listening");
            console.log("listening")
        }

        //   indicate that it is finished redcording
        recognition.onspeechend = function () {
            $(".micBtn").val("Submit");
            console.log("ended")
        }

        recognition.onresult = function (event) {
            var current = event.resultIndex;

            var transcript = event.results[current][0].transcript;
            selectedText = transcript;
            selectedValue = $("#" + transcript).val();

            if (moodsArr.includes(selectedText)) {
                tokenFunction(selectedText);
            } else {
                console.log("Try Again!")
            }
        }
    };
    listenForSpeech();
};

$(".modalBtn").click(function(){
    videoSetUp()
})

function videoSetUp() {
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach('#my_camera');

    $(".takeSnapshot").click(function(){
        take_snapshot();
    })

    // <!Code to handle taking the snapshot and displaying it locally 
    function take_snapshot() {

        // take snapshot and get image data
        Webcam.snap(function (data_uri) {
            // display results in page
            console.log(data_uri);
            document.getElementById('results').innerHTML =
                '<img src="' + data_uri + '"/>';
        });
    }
}


GetSelectedTextValue();