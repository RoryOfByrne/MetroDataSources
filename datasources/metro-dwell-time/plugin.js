function monitorDwellTime(metroClient) {
  loadTime = (new Date).getTime();
  URL = window.location.href;

  window.addEventListener("beforeunload", function() {
    leaveTime = (new Date).getTime();

    let datapoint = {
      "loadTime": loadTime,
      "leaveTime": leaveTime,
      "URL": URL
    }

    console.log(datapoint);
    metroClient.sendDatapoint(datapoint);
  });
}

function initDataSource(metroClient) {
  mc = metroClient;
  console.log("Loading Metro Dwell Time...");
  monitorDwellTime(mc);
}
