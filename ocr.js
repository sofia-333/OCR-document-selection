const submitButton = document.getElementById("submitButton");
const docImage = document.getElementsByClassName("doc-image")[0];
const container = document.getElementsByClassName("container")[0];
var posX, posY, newDiv;
let x1, x2, dropped = true;

// div which will be covering the image
const divLayer = document.getElementsByClassName("div-layer")[0];
divLayer.style.width = docImage.width + "px";
divLayer.style.height = docImage.height + "px";
divLayer.x = docImage.x;
divLayer.y = docImage.y;

divLayer.onmousedown = function (e) {
  dropped = false;
  console.log(e.pageY);
  posX = e.pageX + 5;
  posY = e.pageY + 5;
  //coordinates relative to image(coordinates to send)
  x1 = posX - docImage.x;
  x2 = posY - docImage.y;
  newDiv = document.createElement('div');
  newDiv.classList.add("new-div");
  //div-s real coordinates are relative to this page
  newDiv.style.left = posX + "px";
  newDiv.style.top = posY + "px";
  container.appendChild(newDiv);
};
divLayer.onmousemove = function (e) {
  if (!dropped) {
    console.log("moved");
    let divWidth = e.pageX - posX;
    let divHeight = e.pageY - posY;
    newDiv.style.width = divWidth + "px";
    newDiv.style.height = divHeight + "px";
  }
};
document.onmouseup = function (e) {
  if (newDiv.style.height !== "0px" && newDiv.style.width !== "0px") {
    dropped = true;
  } else {
    container.removeChild(container.lastElementChild);
  }
}; 
