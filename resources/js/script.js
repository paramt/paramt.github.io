window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

window.onload = function(){
  shiftProjectExtra();
  checkToMobilify();

  window.setTimeout(function(){
    document.getElementById("arrow").style.opacity = "1";
    document.getElementById('arrow').classList = 'animated bounce';
  }, 1300)

  window.setTimeout(function(){
    document.getElementById("transition-overlay").style.opacity = "0";
  }, 0)

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

  if(scrollTop < document.body.offsetHeight){
    document.body.style.backgroundColor = "#932524";
  }

  if(scrollTop > document.body.offsetHeight){
    document.body.style.backgroundColor = "#9da4b8";
  }

  if(scrollTop > document.body.offsetHeight*1.75 + document.getElementById("projects").offsetHeight){
    document.body.style.backgroundColor = "#5e825f";
  }

}, false);

function shiftProjectExtra(){
  document.getElementById("pm1").style.bottom = "-" + String(parseInt(document.getElementById("pm1").offsetHeight) - 1) + "px";
  document.getElementById("pm2").style.bottom = "-" + String(parseInt(document.getElementById("pm2").offsetHeight) - 1) + "px";
  document.getElementById("pm3").style.bottom = "-" + String(parseInt(document.getElementById("pm3").offsetHeight) - 1) + "px";

  document.getElementsByClassName("filler")[0].style.height = parseInt(document.getElementById("pm1").offsetHeight) + "px";
}

function checkToMobilify(){
  if(document.getElementById("main-pic").offsetWidth > window.innerWidth){
    document.getElementById("main-pic").style.width = "100vw";
  }

}

document.getElementById("link1").onmouseout = function(){
  document.getElementById('arrow1').className = 'fas fa-angle-right animated fadeOutLeft';
}

document.getElementById("link1").onmouseover = function(){
  document.getElementById('arrow1').style.opacity = '1';
  document.getElementById('arrow1').className = 'fas fa-angle-right animated fadeInLeft';
}

document.getElementById("link2").onmouseout = function(){
  document.getElementById('arrow2').className = 'fas fa-angle-right animated fadeOutLeft';
}

document.getElementById("link2").onmouseover = function(){
  document.getElementById('arrow2').style.opacity = '1';
  document.getElementById('arrow2').className = 'fas fa-angle-right animated fadeInLeft';
}

document.getElementById("link3").onmouseout = function(){
  document.getElementById('arrow3').className = 'fas fa-angle-right animated fadeOutLeft';
}

document.getElementById("link3").onmouseover = function(){
  document.getElementById('arrow3').style.opacity = '1';
  document.getElementById('arrow3').className = 'fas fa-angle-right animated fadeInLeft';
}
