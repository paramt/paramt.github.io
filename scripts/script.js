history.scrollRestoration = "manual";

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
}

window.setTimeout(() => {
  document.body.style.overflow = "visible";
}, 2000);
