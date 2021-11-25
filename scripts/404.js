var query = document.location.href.split("param.me/")[1];

if (query == "timeline" || query == "projects") {
  window.location.href = "https://www.param.me/#" + query;
}

var directories = [
  "1pt",
  "assignments",
  "code-editor",
  "discord-emoji",
  "email-status",
  "IMoCA",
  "kevlar",
  "mathu",
  "mathu-prototype",
  "meme",
  "MemeAdviser",
  "old",
  "projects",
  "resume",
  "sanskrit-quotes-calendar",
  "sumopit",
  "timeline",
  "trackarma",
  "videocloud",
];

var distances = [];
var closest;

for (var i = 0; i < directories.length; i++) {
  var distance = getEditDistance(query.toLowerCase(), directories[i]);

  if (distance < Math.min(...distances) && distance < Math.floor(directories[i].length / 2)) {
    closest = directories[i];
    distances.push(distance);
  }
}

if (closest) {
  window.location.href = "https://www.param.me/" + closest;
} else {
  document.getElementById("error").style.visibility = "visible";
}

function redirectToHome() {
  document.getElementById("transition-overlay").style.opacity = "1";
  document.getElementById("transition-overlay").style.zIndex = "0";
  setTimeout(function () {
    window.location = "/";
  }, 1000);
}
