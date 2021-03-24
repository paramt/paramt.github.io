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

window.setTimeout(() => {
  document.body.style.overflow = "visible";
}, 2000);
