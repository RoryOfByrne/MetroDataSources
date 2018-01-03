const sendDatapoint = function(datapoint) {
  var xhr = new XMLHttpRequest();
  var url = "https://fcq9bypaa2.execute-api.us-east-1.amazonaws.com/prod/data-dump-lambda-function";

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");

  var dataString = JSON.stringify(datapoint);
  console.log(dataString);
  var data = JSON.stringify('{"datasource": "Twitter", "timestamp": 563254, "data": '+dataString+', "user": "dummyUsername"}');
  console.log(data);
  xhr.send(data);
}

const registerTweetActions = function (node) {
  var tweets = node.getElementsByClassName("tweet");

  for(var i=0; i<tweets.length; i++) {
    let tweet = tweets[i];

    // Contains the data identifying this tweet.
    let item = {};

    // Store tweet author.
    let tweetHeaderNode = tweet.getElementsByClassName("stream-item-header")[0];
    let tweetAuthorNode = tweetHeaderNode.getElementsByClassName("username")[0];
    item['tweetAuthor'] = tweetAuthorNode.innerText;


    // Store tweet content.
    let tweetContentNode = tweet.getElementsByClassName("tweet-text")[0];
    item['tweetContent'] = tweetContentNode.innerText;


    // Add reply button click listener.
    let tweetActionsNode = tweet.getElementsByClassName("ProfileTweet-actionList")[0];
    let replyButtonNode = tweetActionsNode.getElementsByClassName("js-actionReply")[0];
    replyButtonNode.addEventListener('click', function() {
      // TODO: Don't just store string.
      let storageItem = {};
      storageItem["TwitterReply-"+Date.now()] = JSON.stringify(item);
      chrome.storage.sync.set(storageItem);
      sendDatapoint(storageItem);
    });

    // Add retweet button click listener.
    let retweetButtonNode = tweetActionsNode.getElementsByClassName("js-actionRetweet")[0];
    retweetButtonNode.addEventListener('click', function() {
      // TODO: Don't just store string.
      let storageItem = {};
      storageItem["TwitterRetweet-"+Date.now()] = JSON.stringify(item);
      chrome.storage.sync.set(storageItem);
      sendDatapoint(storageItem);
    });

    // Add favorite button click listener.
    let favoriteButtonNode = tweetActionsNode.getElementsByClassName("js-actionFavorite")[0];
    favoriteButtonNode.addEventListener('click', function() {
      // TODO: Don't just store string.
      let storageItem = {};
      storageItem["TwitterFavorite-"+Date.now()] = JSON.stringify(item);
      chrome.storage.sync.set(storageItem);
      sendDatapoint(storageItem);
    });
  }
}


const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.nodeType === 1) { // ELEMENT_NODE
        registerTweetActions(node);
      }
    });
  });
});

const config = {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true
};


observer.observe(document.body, config);
registerTweetActions(document.body);
