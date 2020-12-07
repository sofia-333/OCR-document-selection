const submitButton = document.getElementById("submitButton");
const deleteButton = document.getElementById("deleteButton");
const docImage = document.getElementsByClassName("doc-image")[0];
const container = document.getElementsByClassName("container")[0];
let posX, posY, newDiv, created = true, x1, y1, divHeight, divWidth, divLayer,outerDiv;
const dataToSend = new Array;

docImage.onload = function () {
  // div which will be covering the image
  divLayer = document.getElementsByClassName("div-layer")[0];
  divLayer.style.width = docImage.width + "px";
  divLayer.style.height = docImage.height + "px";
  divLayer.x = docImage.x;
  divLayer.y = docImage.y;

  divLayer.onmousedown = function (e) {
    created = false;
    posX = e.pageX - 10;
    posY = e.pageY - 10;
    //coordinates relative to image(coordinates to send)
    x1 = posX - docImage.x;
    y1 = posY - docImage.y;
    newDiv = document.createElement('div');
    newDiv.classList.add("new-div");
    //div-s real coordinates are relative to this page
    // newDiv.style.left = posX + "px";
    // newDiv.style.top = posY + "px";
    //creating div,which will contain 1.new red div 2.delete button
    outerDiv = document.createElement('div');
    outerDiv.classList.add("outer-div");
    outerDiv.style.left = posX + "px";
    outerDiv.style.top = posY + "px";
    outerDiv.appendChild(newDiv);
    container.appendChild(outerDiv);
  };
  divLayer.onmousemove = function (e) {
    if (!created) {
      divWidth = e.pageX - posX - 10;
      divHeight = e.pageY - posY - 10;
      newDiv.style.width = divWidth + "px";
      newDiv.style.height = divHeight + "px";

    }
  };
  document.onmouseup = function (e) {
    //if(!created) - means that new dropdown won't be created when click on div
    if (newDiv.style.height !== "" && newDiv.style.width !== "" && !created) {
      //creating dropdowns
      const dropdown = document.createElement("select");
      dropdown.classList.add("dropdown");
      dropdown.style.width = divWidth + "px";
      dropdown.style.height = divHeight + "px";
      for (let i = 0; i < 3; i++) {
        let option = new Option;
        option.text = `something ${i}`;
        option.value = 'somethings value';
        dropdown.options.add(option);
      }
      newDiv.appendChild(dropdown);
      // creating delete buttons
      const deleteButton = document.createElement('button');
      deleteButton.classList.add("delete-button");
      deleteButton.style.left = divWidth + 1 + "px";
      deleteButton.style.top = -1 + "px";
      deleteButton.innerText = "x";
      outerDiv.appendChild(deleteButton);
      created = true;
      
      const delButtons = document.querySelectorAll(".delete-button");
      delButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          container.removeChild(btn.parentElement);
        });
      });
      //Create new JSON object and add it to array
      // const parameters = {
      //   left: x1,
      //   top: y1,
      //   height: newDiv.style.height,
      //   width: newDiv.style.width,
      // };
      // dataToSend.push(parameters);
    }
    else {
      container.removeChild(container.lastElementChild);
    }
  };

  submitButton.addEventListener('click', (e) => {
    console.log(dataToSend);
  });

};
