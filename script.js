var clientId = 'e385e97bbf0c45b2a800391010d7d594';
var clientSecret = '574cc1ada15544f78f9964403b0bd9be';
var selectedText = $("#moodDropdown option:selected").text();
var gifImage = $("#currentGif");



function GetSelectedTextValue() {
    tokenFunction();
};
GetSelectedTextValue();

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
    selectedValue = $("#moodDropdown option:selected").val();
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
    var selectedText = $("#moodDropdown option:selected").text();

    $("#playlistName").text(selectedText);
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
        var albumImg = $("<img>")
        albumImg.attr("src", data.items[i].track.album.images[1].url)
        songAlbum.append(albumImg);
        trackInfo.append(songAlbum);

        songList.append(trackInfo);
    }
    grabGif(selectedText);
}


function grabGif(selectedText) {
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

