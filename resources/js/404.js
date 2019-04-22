var query = document.location.href.split("param.me/")[1]
var directories = ["1pt", "code-editor", "discord-emoji", "email-status", "kevlar", "mathu", "mathu-prototype", "meme", "MemeAdviser", "old", "projects", "sanskrit-quotes-calendar", "sumopit", "trackarma"]
var distances = []
var closest;

for(var i = 0; i<directories.length; i++){
  var distance = getEditDistance(query.toLowerCase(), directories[i])
  
  if(distance < Math.min(...distances) && distance < Math.floor(directories[i].length/2)){
    closest = directories[i];
    distances.push(distance);
  }
}

if(closest){
  window.location.href = "https://www.param.me/" + closest;
} else {
  window.location.href = "https://www.param.me/";
}