const registerEventsHandler = function(node) {
  // The nodes we want to attach to are very nicely named:
  // "post-action-[upvote|downvote|favorite]"
  // This means we can just do a for loop on the keyword:
  let eventTypes = ["upvote", "downvote", "favorite"];

  for(var i=0; i<eventTypes.length; i++) {
    let eventType = eventTypes[i];
    let eventNode = node.getElementsByClassName("post-action-"+eventType)[0];

    // Got the node, attach the click listener:
    eventNode.addEventListener("click", function(event) {
      sendDatapoint(eventType);
    });
  }
}

/*
 * Helper function to send a datapoint to MetroClient for different event
 * types.
 */
const sendDatapoint = function(eventType) {
  // Create the datapoint:
  let datapoint = {};
  datapoint['event'] = eventType;
  datapoint['time'] = Date.now();
  datapoint['url'] = window.location.href;

  // And ship it off:
  mc.sendDatapoint(datapoint);
}


var mc;
function initDataSource(metroClient) {
  mc = metroClient;
  console.log("Beginning imgur-basic-interaction data source.");

  // On a page load we want to push it as a datapoint:
  sendDatapoint("load");

  // Then start our plugin.
  registerEventsHandler(document.body);
}
