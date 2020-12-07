const submitButton = document.getElementById("submitButton");
const docImage = document.getElementsByClassName("doc-image")[0];
const container = document.getElementsByClassName("container")[0];
let posX, posY, newDiv, dropped = true, x1, y1, divHeight, divWidth, divLayer;
const dataToSend = new Array;

docImage.onload = function() {
  // div which will be covering the image
  divLayer = document.getElementsByClassName("div-layer")[0];
  divLayer.style.width = docImage.width + "px";
  divLayer.style.height = docImage.height + "px";
  divLayer.x = docImage.x;
  divLayer.y = docImage.y;

  divLayer.onmousedown = function (e) {
    dropped = false;
    posX = e.pageX - 10;
    posY = e.pageY - 10;
    //coordinates relative to image(coordinates to send)
    x1 = posX - docImage.x;
    y1 = posY - docImage.y;
    newDiv = document.createElement('div');
    newDiv.classList.add("new-div");
    //div-s real coordinates are relative to this page
    newDiv.style.left = posX + "px";
    newDiv.style.top = posY + "px";
    container.appendChild(newDiv);
  };
  divLayer.onmousemove = function (e) {
    if (!dropped) {
      divWidth = e.pageX - posX - 10;
      divHeight = e.pageY - posY - 10;
      newDiv.style.width = divWidth + "px";
      newDiv.style.height = divHeight + "px";
    }
  };
  document.onmouseup = function (e) {
    if (newDiv.style.height !== "" && newDiv.style.width !== "") {
      dropped = true;
      //Create new JSON object and add it to array
      const parameters = {
        left : x1,
        top : y1,
        height : newDiv.style.height,
        width : newDiv.style.width,
      };
      dataToSend.push(parameters);
    } else {
      container.removeChild(container.lastElementChild);
    }
  };

  submitButton.addEventListener('click', (e) => {
    console.log(dataToSend);
  });

};
