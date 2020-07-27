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
        $("#spotLink").attr("target", "_blank");
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
            gifImage.attr("src", "https://media.giphy.com/media/1cMSWoZlxhO8w/giphy.gif");
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

                    setHistory(imageUrl);
                });
            }
        }
        // getMoodHistory();

    function setHistory(imageUrl) {
        var oldMoods = JSON.parse(localStorage.getItem('moodsArray')) || [];

        var moodStorage = {
            name: selectedText,
            gif: imageUrl,
            timeStamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        };

        oldMoods.unshift(moodStorage);

        localStorage.setItem('moodsArray', JSON.stringify(oldMoods));

    }

    // function getMoodHistory() {
    //     var moodStorage = JSON.parse(localStorage.getItem("moodsArray"));
    //     for (var i = 0; i < moodStorage.length; i++) {
    //         if (i > 7) {
    //             return;
    //         } else {
    //             var historyRow = $(".small-up-2");
    //             var div = $("<div>").addClass("column");
    //             var img = $("<img>").addClass("thumbnail" + i);
    //             $(".thumbnail" + i).attr("src", moodStorage[i].gif);
    //             div.append(img);
    //             var text = $("<h5>").addClass("text-display" + i);
    //             $(".text-display" + i).text(moodStorage[i].name.charAt(0).toUpperCase() + moodStorage[i].name.slice(1));
    //             div.append(text);
    //             var date = $("<h5>").addClass("date-display" + i);
    //             $(".date-display" + i).text(moodStorage[i].timeStamp);
    //             div.append(date);
    //             historyRow.append(div);
    //         }
    //     }
    // }

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
            $("#micImg").removeClass("fa fa-microphone fa-5x");
            $("#micImg").addClass("fa fa-microphone-slash fa-5x")
            console.log("listening");
        }

        //   indicate that it is finished redcording
        recognition.onspeechend = function () {
            $(".micBtn").val("Submit");
            $("#micImg").removeClass("fa fa-microphone-slash fa-5x")
            $("#micImg").addClass("fa fa-microphone fa-5x");
            console.log("ended");
        }

        recognition.onresult = function (event) {
            var current = event.resultIndex;

            var transcript = event.results[current][0].transcript;
            selectedText = transcript;
            selectedValue = $("#" + transcript).val();

            if (moodsArr.includes(selectedText)) {
                tokenFunction(selectedText);
            } else {
                console.log("Try Again!");
            }
        }
    };
    listenForSpeech();

    $(".modalBtn").click(function () {
        faceRecog();
    })

    function faceRecog() {
        var alreadyRan = false;
        var video = document.getElementById('video');

        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(startVideo)

        function startVideo() {
            navigator.getUserMedia(
                { video: {} },
                stream => video.srcObject = stream,
                err => console.error(err)
            )
        }

        video.addEventListener('play', () => {
            if (alreadyRan === true) {
                return;
            } else {

                var canvas = faceapi.createCanvasFromMedia(video);
                var displaySize = { width: video.width, height: video.height };
                faceapi.matchDimensions(canvas, displaySize);


                var button = document.getElementById("button");
                button.addEventListener("click", detectMood);

                async function detectMood() {
                    if (alreadyRan === true) {
                        return;
                    } else {
                        var pleaseWait = $("#waiting");
                        pleaseWait.text("Please Wait...");
                        video.pause();
                        alreadyRan = true
                        var detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

                        // get most pronounced expression and assign it to a mood
                        var mostMood = Object.keys(detections.expressions).reduce(function (a, b) { return detections.expressions[a] > detections.expressions[b] ? a : b });
                        pleaseWait.text("Your mood: " + mostMood)
                        if (mostMood === "angry") {
                            selectedText = "aggressive"
                        } else if (mostMood === "neutral") {
                            selectedText = "relaxed"
                        } else if (mostMood === "disgusted") {
                            selectedText = "classy"
                        } else if (mostMood === "surprised") {
                            selectedText = "energetic"
                        }
                        else {
                            selectedText = mostMood;
                        }

                        // stop the camera
                        var mediaStream = video.srcObject;
                        var tracks = mediaStream.getTracks();
                        tracks.forEach(track => track.stop());

                        // add the mood text
                        pleaseWait.text("Your mood: " + selectedText);
                        selectedValue = $("#" + selectedText).val();
                        console.log(selectedText);
                        tokenFunction(selectedText);
                    };
                }
            }
        })
    }
    // getMoodHistory();
};
GetSelectedTextValue();