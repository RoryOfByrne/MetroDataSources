// List of events that when they occur will send a datapoint.
const triggeringEvents = [
  "click",
  "copy",
  "cut",
  "paste",
  "drag",
  "drop",
  "keypress",
  "wheel"
]

const registerEventsHandler = function(node) {
  let upvoteNode = node.getElementsByClassName(post-action-upvote);
  console.log(upvoteNode);
}


/*
 * Helper function to send a datapoint to MetroClient for different event
 * types.
 */
const sendDatapoint = function(eventType, time) {
  // Create the datapoint:
  let datapoint = {};
  datapoint['event'] = eventType;
  datapoint['time'] = time;
  datapoint['url'] = window.location.href;

  // And ship it off:
  mc.sendDatapoint(datapoint);
}


var mc;
function initDataSource(metroClient) {
  mc = metroClient;
  console.log("Beginning imgur-basic-interaction data source.");

  // On a page load we want to push it as a datapoint:
  sendDatapoint("load", Date.now());
  //mc.storeData("timepoint", currentTime);

  // Then start our plugin.
  registerEventsHandler(document.body);
}
