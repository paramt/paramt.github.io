history.scrollRestoration = "manual";

var query = document.location.href.split("param.me/")[1];

if (query == "#projects") {
  switchTab(document.getElementById("tab1"), "#card2");
} else if (query == "#timeline") {
  switchTab(document.getElementById("tab1"), "#card3");
}

function moveUp(element, id) {
  document.querySelector(id).style.transform = "translateY(-15px)";
  element.style.transform = "translateY(-15px)";
}

function moveDown(element, id) {
  document.querySelector(id).style.transform = "translateY(0px)";
  element.style.transform = "translateY(0px)";
}

function switchTab(element, id) {
  document.querySelectorAll(".card").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelector(id).classList.add("active");
  element.classList.add("active");

  window.scroll({
    top: window.innerHeight - 200,
    behavior: "smooth",
  });
}

window.setTimeout(() => {
  document.body.style.overflow = "visible";
}, 2000);

window.onload = function() {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(xhttp.responseText);
        var date = new Date(Date.parse(data[0].commit.author.date));
        document.getElementById("last-updated").innerHTML = timeSince(date) + " ago";
      }
  };
  xhttp.open("GET", "https://api.github.com/repos/paramt/paramt.github.io/commits?path=_config.yml&page=1&per_page=1", true);
  xhttp.send();

}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }

  interval = seconds / 2592000;

  if (interval > 1) {
    return Math.floor(interval) + " months";
  }

  interval = seconds / 86400;

  if (interval > 1) {
    return Math.floor(interval) + " days";
  }

  interval = seconds / 3600;

  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }

  interval = seconds / 60;

  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }

  return Math.floor(seconds) + " seconds";
}
