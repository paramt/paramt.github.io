history.scrollRestoration = "manual";

var query = document.location.href.split("param.netlify.app/")[1];

if(query == "projects" || query == "#projects") {
  switchTab(document.getElementById("tab1"), "#card2");
} else if(query == "timeline" || query == "#timeline") {
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

function copyDiscord(discordTag) {
  const temp = document.createElement("textarea");
  temp.value = discordTag;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

  Swal.fire({
    title: "Copied",
    text: `${discordTag} copied to clipboard`,
    icon: "success",
  });
}
