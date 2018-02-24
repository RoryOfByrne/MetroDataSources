const registerEventsHandler = function(node) {
  // First we need to get the video player element:
  let videoPlayerNode = document.getElementById("movie_player");
  // There is a class that is dynamically changed on this element. Either
  // "paused-mode" or "playing-mode" or "ended-mode". We are going to
  // setInterval on this and monitor it for changes to the class. When it
  // changes, we fire that event.
  let currentEvent = "";

  setInterval(function() {
    let playing = videoPlayerNode.classList.contains("playing-mode");
    let paused = videoPlayerNode.classList.contains("paused-mode");
    let ended = videoPlayerNode.classList.contains("ended-mode");

    if(playing && currentEvent != "play") {
      sendDatapoint("play");
      currentEvent = "play";
    } if(paused && currentEvent != "pause") {
      sendDatapoint("pause");
      currentEvent = "pause";
    } if(ended && currentEvent != "finished") {
      sendDatapoint("finished");
      currentEvent = "finished";
    }
  }, 250);
}

const sendDatapoint = function(eventType) {
  // Create the datapoint:
  let datapoint = {};
  datapoint['event'] = eventType;
  datapoint['time'] = Date.now();
  datapoint['url'] = window.location.href;
  datapoint['title'] = document.title;

  // And ship it off:
  mc.sendDatapoint(datapoint);
}

var mc;
function initDataSource(metroClient) {
  mc = metroClient;
  console.log("Beginning basic-youtube-actions data source.");

  // Then start our plugin.
  registerEventsHandler(document.body);
}
