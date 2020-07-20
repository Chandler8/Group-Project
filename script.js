// Playlist ID's

var moodObj = {
    happy: "1h90L3LP8kAJ7KGjCV2Xfd",
    sad: "7ABD15iASBIpPP5uJ5awvq",
    energetic: "2lmcuXNkjYOoQeXvwqvvFT",
    aggressive: "0kbIVraS3Xa7FhvAb9KSGe",
    relaxed: "4vQ0ixS6GKuNV0xMmjfk9j",
    sleepy: "6uMZkWBIIY3v1U3G9Stoi4",
    classy: "50Tl9aaCBX9Ys5kc0DbJeH",
    indefferent: "1hY0i2y7ByRgFkcLHZZdVN"
};

const clientId = 'e385e97bbf0c45b2a800391010d7d594';
const clientSecret = '574cc1ada15544f78f9964403b0bd9be';

// POST request to spotify asking for an access token
var tokenVar = async function tokenFunction() {
    var result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    
    var data = await result.json();
    // console.log(data.access_token);
    var accessToken = data.access_token;
    getPlaylist(accessToken);
};
tokenVar();

var playlist_id = moodObj.happy;
var queryURL = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?offset=0&limit=20";

// GET request to spotify sending my access token and asking for a playlist
function getPlaylist(accessToken){
    $.ajax({
        url: queryURL,
        type: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + accessToken
        },
        success: function(data) {
            console.log(data);
            console.log(data.items[1].track.name)
        }
    });


}




