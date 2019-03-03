document.getElementById('main-pic').ondragstart = function() { return false; };
window.onload = function(){
  window.setTimeout(function(){
    document.getElementById("arrow").style.opacity = "1";
    document.getElementById('arrow').classList = 'animated bounce';
  }, 1500)

  window.setTimeout(function(){
    document.getElementById("main-pic").className = "main-pic animated fadeInHalf";
  }, 200)

  window.setTimeout(function(){
    document.getElementById("main-text").style.visibility = "visible";
    document.getElementById("main-text").className = "main-text animated fadeIn";
  }, 700)

  window.setTimeout(function(){
    document.getElementById("icons").style.visibility = "visible";
    document.getElementById("icons").className = "icons animated fadeIn";
  }, 900)
}

function highlight(element){
  for(var i = 0; i < document.getElementsByClassName("icon").length; i++){
    document.getElementsByClassName("icon")[i].style = "color: #b7b7b7"
  }
}

function unHighlight(element){
  for(var i = 0; i < document.getElementsByClassName("icon").length; i++){
    document.getElementsByClassName("icon")[i].style = "color: white"
  }
}

window.addEventListener("scroll", function(){
  var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  if(scrollTop !== 0){
    document.getElementById('arrow').classList = 'animated fadeOutUp';
  } else {
    document.getElementById('arrow').classList = 'animated bounce';
  }

}, false);
