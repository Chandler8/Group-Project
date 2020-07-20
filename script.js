const clientId = 'e385e97bbf0c45b2a800391010d7d594';
const clientSecret = '574cc1ada15544f78f9964403b0bd9be';
var playlist_id = "";

function GetSelectedTextValue(moodDropdown) {
    var selectedValue = moodDropdown.value;
    playlist_id = selectedValue;
    var queryURL = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?offset=0&limit=15";
    
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
        // console.log(data.access_token);
        var accessToken = data.access_token;
        getPlaylist(accessToken);
    };
    
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

                var songList = $("#songList")            
                
                for(var i = 0; i<data.items.length; i++){
                var trackInfo = $("<tr>");
                
                var songName = $("<td>");
                songName.text(data.items[i].track.name);
                trackInfo.append(songName);
                
                var songArtist = $("<td>");
                songArtist.text(data.items[i].track.artists[0].name);
                trackInfo.append(songArtist);

                var songAlbum = $("<td>");
                songAlbum.text(data.items[i].track.album.name);
                trackInfo.append(songAlbum);

                songList.append(trackInfo);

                }
            }
        }); 
    } 
}
    
    
    
