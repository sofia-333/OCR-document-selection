import Stack from "./stack.js";
const submitButton = document.getElementById("submitButton");
const deleteButton = document.getElementById("deleteButton");
const docImage = document.getElementsByClassName("doc-image")[0];
const container = document.getElementsByClassName("container")[0];
let posX, posY, newDiv, created = true, x1, y1, divHeight, divWidth, divLayer, outerDiv, divNumber = 0;
let dragBtnParent, moved = true, dragPosX, dragPosY, oldDragPosX, oldDragPosY, isResizing;
const dataToSend = new Array, undoStack = new Stack, redoStack = new Stack;
let currentResizer, currentDropdown, currentDiv, currentDelete, currentDrag, prevX, prevY, outerDivCopy, before_after = new Array;;

docImage.onload = () => {
  // div which will be covering the image
  createDivLayer(docImage);

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
    createOuterDiv(newDiv);

    divLayer.onmousemove = function (e) {
      if (!created && !isResizing) {
        divWidth = e.pageX - posX - 10;
        divHeight = e.pageY - posY - 10;
        newDiv.style.width = divWidth + "px";
        newDiv.style.height = divHeight + "px";

      }
    };
    document.onmouseup = function (e) {
      //if(!created) - means that new dropdown won't be created when click on div
      if (newDiv.style.height !== "" && newDiv.style.width !== "" && !created) {
        createDropdown(newDiv);
        //deleting
        createDeleteButton(outerDiv);
        deleteDiv(container);
        //dragging
        createDragButton(outerDiv);
        const dragButtons = document.querySelectorAll(".drag-button");
        document.addEventListener('mousedown', (e) => {
          if (e.target.classList.contains("drag-button") || e.target.classList.contains("fa-arrows-alt")) {
            dragMousedown(e);
          }
        });
        //resizing
        createResizePoints(newDiv);
        resizeDiv();
        created = true; //new red div is created
      }
      else if (newDiv.style.height === "" && newDiv.style.width === "") {
        container.removeChild(container.lastElementChild);
      }
    };
    submitButton.addEventListener('click', (e) => console.log(dataToSend));
  };
  function createDivLayer(docImage) {
    divLayer = document.getElementsByClassName("div-layer")[0];
    divLayer.style.width = docImage.width + "px";
    divLayer.style.height = docImage.height + "px";
    divLayer.x = docImage.x;
    divLayer.y = docImage.y;
  }
  function createOuterDiv(newDiv) {
    outerDiv = document.createElement('div');
    outerDiv.classList.add("outer-div");
    outerDiv.style.left = posX + "px";
    outerDiv.style.top = posY + "px";
    outerDiv.appendChild(newDiv);
    container.appendChild(outerDiv);
  }
  function createDropdown(newDiv) {
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
  }
  function createDeleteButton(outerDiv) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("delete-button");
    deleteButton.style.left = divWidth + 1 + "px";
    deleteButton.style.top = -5 + "px";
    deleteButton.innerText = "x";
    outerDiv.appendChild(deleteButton);
  }
  function deleteDiv(container) {
    const delButtons = document.querySelectorAll(".delete-button");
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains("delete-button")) {
        if (e.target.parentElement.parentElement === container) {
          container.removeChild(e.target.parentElement);
        }
      }
    });
  }

  function createDragButton(outerDiv) {
    const dragButton = document.createElement('button');
    dragButton.classList.add("drag-button");
    dragButton.style.left = divWidth + 1 + "px";
    dragButton.style.top = -5 + "px";
    //drag icon
    dragButton.appendChild(document.createElement('i'));
    dragButton.getElementsByTagName('i')[0].classList.add("fas");
    dragButton.getElementsByTagName('i')[0].classList.add("fa-arrows-alt");
    outerDiv.appendChild(dragButton);
  }
  function dragMousedown(e) {
    moved = false;
    oldDragPosX = e.pageX;
    oldDragPosY = e.pageY;
    //if we click on icon(inside the button) --> parent is dragButton; if we click on dragButton --> parent is outerdiv;
    //we need to move outer div; 1)outerDiv = e.target.pareentElement.parentElement 2)outerDiv = e.target.pareentElement
    if (e.target.tagName === 'BUTTON') {
      dragBtnParent = e.target.parentElement;
    }
    else if (e.target.tagName === 'I') {
      dragBtnParent = e.target.parentElement.parentElement;
    }
    document.addEventListener('mousemove', dragMousemove);
    document.addEventListener('mouseup', dragMouseup);
  }
  function dragMousemove(e) {
    if (!moved && !isResizing) {
      dragPosX = oldDragPosX - e.pageX;
      dragPosY = oldDragPosY - e.pageY;
      oldDragPosX = e.pageX;
      oldDragPosY = e.pageY;
      dragBtnParent.style.left = dragBtnParent.offsetLeft - dragPosX + "px";
      dragBtnParent.style.top = dragBtnParent.offsetTop - dragPosY + "px";
    }
  }
  function dragMouseup(e) {
    moved = true;
  }
  function createResizePoints(newDiv) {
    let res_se = document.createElement('div');
    res_se.classList.add("resizers");
    res_se.classList.add("se");
    newDiv.appendChild(res_se);
  }
  function resizeDiv() {
    const resizers = document.querySelectorAll(".resizers");
    resizers.forEach((resizer) => resizer.addEventListener("mousedown", resizeMousedown));
  }
  function resizeMousedown(e) {
    currentResizer = e.target;
    currentDiv = e.target.parentElement;
    currentDropdown = e.target.parentElement.getElementsByClassName("dropdown")[0];
    currentDelete = e.target.parentElement.parentElement.getElementsByClassName("delete-button")[0];
    currentDrag = e.target.parentElement.parentElement.getElementsByClassName("drag-button")[0];

    isResizing = true;
    prevX = e.pageX;
    prevY = e.pageY;

    window.addEventListener("mousemove", resizeMousemove);
    window.addEventListener("mouseup", resizeMouseup);
  }
  function resizeMousemove(e) {
    const divToResize = currentDiv.getBoundingClientRect();
    const initialRight = divToResize.right;
    if (currentResizer.classList.contains("se")) {
      seResize(e, divToResize);
    }
    prevX = e.pageX;
    prevY = e.pageY;
  }
  function resizeMouseup() {
    window.removeEventListener("mousemove", resizeMousemove);
    window.removeEventListener("mouseup", resizeMouseup);
    isResizing = false;
  }
  function seResize(e, divToResize) {
    currentDiv.style.width = currentDropdown.style.width = divToResize.width - (prevX - e.pageX) - 2 + "px";
    currentDiv.style.height = currentDropdown.style.height = divToResize.height - (prevY - e.pageY) - 2 + "px";

    currentDelete.style.left = currentDrag.style.left = divToResize.width + 1 + (prevX - e.pageX) + "px";
    currentDelete.style.top = currentDrag.style.top = - 5 - (prevY - e.pageY) + "px";
    console.log(divToResize, "2");

  }
};
docImage.src = "doc1.jpg";