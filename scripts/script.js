function showProjects() {}

function moveUp(element, id) {
  document.querySelector(id).style.transform = "translateY(-10px)";
  element.style.transform = "translateY(-10px)";
  element.style.cursor = "pointer";
}

function moveDown(element, id) {
  document.querySelector(id).style.transform = "translateY(0px)";
  element.style.transform = "translateY(0px)";
  element.style.cursor = "default";
}
