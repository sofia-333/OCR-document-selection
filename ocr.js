const submitButton = document.getElementById("submitButton");
const deleteButton = document.getElementById("deleteButton");
const docImage = document.getElementsByClassName("doc-image")[0];
const container = document.getElementsByClassName("container")[0];
let posX, posY, newDiv, created = true, x1, y1, divHeight, divWidth, divLayer, outerDiv;
let dragBtnParent, moved = true, dragPosX, pos1, dragPosY, pos2;
const dataToSend = new Array;

docImage.onload = () => {
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

    //creating div,which will contain 1.new red div 2.delete button
    outerDiv = document.createElement('div');
    outerDiv.classList.add("outer-div");
    outerDiv.style.left = posX + "px";
    outerDiv.style.top = posY + "px";
    outerDiv.appendChild(newDiv);
    container.appendChild(outerDiv);
    divLayer.onmousemove = function (e) {
      if (!created) {
        divWidth = e.pageX - posX - 10;
        divHeight = e.pageY - posY - 10;
        newDiv.style.width = divWidth + "px";
        newDiv.style.height = divHeight + "px";

      }
    };
    window.onmouseup = function (e) {
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
        deleteButton.style.top = -5 + "px";
        deleteButton.innerText = "x";
        outerDiv.appendChild(deleteButton);
        //click on delete button
        const delButtons = document.querySelectorAll(".delete-button");
        delButtons.forEach(btn => {
          btn.addEventListener('click', (e) => {
            if (e.target === btn && btn.parentElement.parentElement === container) {
              container.removeChild(btn.parentElement);
            }
          });
        });
        //creating drag button
        const dragButton = document.createElement('button');
        dragButton.classList.add("drag-button");
        dragButton.style.left = divWidth + 1 + "px";
        dragButton.style.top = -5 + "px";
        //drag icon
        dragButton.appendChild(document.createElement('i'));
        dragButton.getElementsByTagName('i')[0].classList.add("fas");
        dragButton.getElementsByTagName('i')[0].classList.add("fa-arrows-alt");
        outerDiv.appendChild(dragButton);
        //drag
        const dragButtons = document.querySelectorAll(".drag-button");
        dragButtons.forEach(btn => {
          btn.addEventListener('mousedown', (e) => {
            moved = false;
            pos1 = e.pageX;
            pos2 = e.pageY;
            //if we click on icon(inside the button) --> parent is dragButton; if we click on dragButton --> parent is outerdiv;
            //we need to move outer div; 1)outerDiv = e.target.pareentElement.parentElement 2)outerDiv = e.target.pareentElement
            if (e.target.tagName === 'BUTTON') {
              console.log("B");
              dragBtnParent = e.target.parentElement;
            }
            else if (e.target.tagName === 'I') {
              console.log("i");
              dragBtnParent = e.target.parentElement.parentElement;
            }
            console.log(dragBtnParent);

            window.addEventListener('mousemove', (e) => {
              if (!moved) {
                dragPosX = pos1 - e.pageX;
                dragPosY = pos2 - e.pageY;
                pos1 = e.pageX;
                pos2 = e.pageY;
                dragBtnParent.style.left = dragBtnParent.offsetLeft - dragPosX + "px";
                dragBtnParent.style.top = dragBtnParent.offsetTop - dragPosY + "px";
              }
            });
            window.addEventListener('mouseup', (e) => {
              moved = true;
            });
          });
        });
        created = true; //new red div is created
      }
      else if (newDiv.style.height === "" && newDiv.style.width === "") {
        container.removeChild(container.lastElementChild);
      }
    };

    submitButton.addEventListener('click', (e) => {
      console.log(dataToSend);
    });
  };

};

