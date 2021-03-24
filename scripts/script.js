history.scrollRestoration = "manual";

function moveUp(element, id) {
  document.querySelector(id).style.transform = "translateY(-15px)";
  element.style.transform = "translateY(-15px)";
  element.style.cursor = "pointer";
}

function moveDown(element, id) {
  document.querySelector(id).style.transform = "translateY(0px)";
  element.style.transform = "translateY(0px)";
  element.style.cursor = "default";
}

function switchTab(id) {
  document.querySelector("#about").classList.remove("active");
  document.querySelector("#projects").classList.remove("active");
  document.querySelector("#item3").classList.remove("active");
  document.querySelector("#achievements").classList.remove("active");

  document.querySelector(id).classList.add("active");
}

window.setTimeout(() => {
  document.body.style.overflow = "visible";
}, 2000);
