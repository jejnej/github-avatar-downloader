var request = require('request');
require('dotenv').config()
// var secrets = require("./secrets.js");
var fs = require('fs');
var rOwner = process.argv[2];
var rName = process.argv[3];
var dir = './avatars';
var token = process.env.GITHUB_TOKEN
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (rOwner === undefined || rName === undefined) {
    console.log("Please provide valid Repo Owner and Repo Name");
    return;
  }


  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token "  + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    res.setEncoding('utf8');
    if (res.statusCode === 401 || res.statusCode === 404) {

    console.log("This repository/owner does not exist, or authorization failed");
   return;
   }
   else if(token === undefined) {
    console.log("Please provide .env file or the correct information in the .env file")
  return;
  }
    var arr = JSON.parse(body);
    arr.forEach(function(user){

  //This is to check if the avatar directory exists
    if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
   }

    cb(err, user)

   });
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function (err) {
         throw err;
      })
  .pipe(fs.createWriteStream(filePath));
}



getRepoContributors(rOwner, rName, function(err, result) {
  if(err) {
  console.log("Please provide a valid Repo Owner and Repo Name", err);
  } else {
  downloadImageByURL(result.avatar_url, "avatars/"+ result.login +".jpg")
  }
});

