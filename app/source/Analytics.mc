using Toybox.Communications;

class Analytics {
  
  var http;
  var url = "https://www.google-analytics.com/collect";
  var device;
  var analyticsOn = true;

  function initialize() {
    http = new Http();
    device = System.getDeviceSettings();
  }

  function bodyBuilder(screenName) {

    var uniqueIdentifier;

    if (device has :uniqueIdentifier) {
      uniqueIdentifier = device.uniqueIdentifier;
    } else {
      uniqueIdentifier = "default";
    }

    var body = {
      "v" => "1",
      "t" => "screenview",
      "tid" => "UA-77110226-1",
      "cid" => uniqueIdentifier,
      "an" => "sendpoints",
      "av" => "2.0.0",
      "cd" => screenName
    };

    return body;
  }

  function screen(screenName) {
    if (analyticsOn) {
      http.post(url, bodyBuilder(screenName), method(:empty));
    }
  }

  function empty(responseCode, data) {
  }
}