var request = require('request');
var secrets = require("./secrets.js");

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token "  + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    res.setEncoding('utf8');
    var arr = JSON.parse(body);
    arr.forEach(function(elem){
      cb(err, elem.avatar_url)
    });
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if(err) {
  console.log("Errors:", err);
  } else {
  console.log("Avatar:", result);
  }
});