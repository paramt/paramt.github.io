if (window.innerWidth < 460) {
  window.location.href = "https://www.param.me/old"
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

window.onload = function(){
  resizeProjectDivs();
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
    document.body.style.backgroundColor = "#5e825f";
  }

  if(scrollTop > document.body.offsetHeight*1.75 + document.getElementById("c1").offsetHeight){
    document.body.style.backgroundColor = "#9da4b8";
  }

}, false);

function resizeProjectDivs(){
  var project1 = document.getElementById("p1");
  var project2 = document.getElementById("p2");
  var project3 = document.getElementById("p3");

  var biggest = Math.max(project1.offsetHeight, project2.offsetHeight, project3.offsetHeight);

  project1.style.height = biggest + "px";
  project2.style.height = biggest + "px";
  project3.style.height = biggest + "px";
}

function shiftProjectExtra(){
  document.getElementById("pm1").style.bottom = "-" + String(parseInt(document.getElementById("pm1").offsetHeight) - 1) + "px";
  document.getElementById("pm2").style.bottom = "-" + String(parseInt(document.getElementById("pm2").offsetHeight) - 1) + "px";
  document.getElementById("pm3").style.bottom = "-" + String(parseInt(document.getElementById("pm3").offsetHeight) - 1) + "px";

  document.getElementsByClassName("filler")[0].style.height = parseInt(document.getElementById("pm1").offsetHeight) + "px";
}

function checkToMobilify(){
  if(window.innerHeight < 850){
    document.getElementById("c1").style.padding = "100px 0 100px 0";
  }

  if(window.innerWidth <= 1000){
    document.getElementById("c1").style.padding = "100px 0 100px 0";
    document.getElementsByClassName("filler")[0].style.height = "0px";
  }

  if(document.getElementById("main-pic").offsetWidth > window.innerWidth){
    document.getElementById("main-pic").style.width = "100vw";
  }

}
