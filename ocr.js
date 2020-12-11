const submitButton = document.getElementById("submitButton");
const deleteButton = document.getElementById("deleteButton");
const docImage = document.getElementsByClassName("doc-image")[0];
const container = document.getElementsByClassName("container")[0];
let posX, posY, newDiv, created = true, x1, y1, divHeight, divWidth, divLayer, outerDiv;
let dragBtnParent, moved = true, dragPosX, dragPosY, oldDragPosX, oldDragPosY, isResizing;
const dataToSend = new Array;

docImage.onload = () => {
  // div which will be covering the image
  CreateDivLayer(docImage);

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
    CreateOuterDiv(newDiv);

    divLayer.onmousemove = function (e) {
      if (!created && !isResizing) {
        divWidth = e.pageX - posX - 10;
        divHeight = e.pageY - posY - 10;
        newDiv.style.width = divWidth + "px";
        newDiv.style.height = divHeight + "px";

      }
    };  
    window.onmouseup = function (e) {
      //if(!created) - means that new dropdown won't be created when click on div
      if (newDiv.style.height !== "" && newDiv.style.width !== "" && !created) {
        CreateDropdown(newDiv);
        //click on delete button
        CreateDeleteButton(outerDiv);
        DeleteDiv(container);
        //dragging
        CreateDragButton(outerDiv);
        const dragButtons = document.querySelectorAll(".drag-button");
        dragButtons.forEach(btn => btn.addEventListener('mousedown', DragMousedown));
        //resizing
        CreateResizePoints(newDiv);
        ResizeDiv();
        created = true; //new red div is created
      }
      else if (newDiv.style.height === "" && newDiv.style.width === "") {
        container.removeChild(container.lastElementChild);
      }
    };
    submitButton.addEventListener('click', (e) => console.log(dataToSend));
  };
  function CreateDivLayer(docImage) {
    divLayer = document.getElementsByClassName("div-layer")[0];
    divLayer.style.width = docImage.width + "px";
    divLayer.style.height = docImage.height + "px";
    divLayer.x = docImage.x;
    divLayer.y = docImage.y;
  }
  function CreateOuterDiv(newDiv){
    outerDiv = document.createElement('div');
    outerDiv.classList.add("outer-div");
    outerDiv.style.left = posX + "px";
    outerDiv.style.top = posY + "px";
    outerDiv.appendChild(newDiv);
    container.appendChild(outerDiv);
  }
  function CreateDropdown(newDiv) {
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
  function CreateDeleteButton(outerDiv) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("delete-button");
    deleteButton.style.left = divWidth + 1 + "px";
    deleteButton.style.top = -5 + "px";
    deleteButton.innerText = "x";
    outerDiv.appendChild(deleteButton);
  }
  function DeleteDiv(container) {
    const delButtons = document.querySelectorAll(".delete-button");
    delButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target === btn && btn.parentElement.parentElement === container) {
          container.removeChild(btn.parentElement);
        }
      });
    });
  }
  function CreateDragButton(outerDiv) {
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
  function DragMousedown(e) {
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

    window.addEventListener('mousemove', (e) => {
      if (!moved && !isResizing) {
        dragPosX = oldDragPosX - e.pageX;
        dragPosY = oldDragPosY - e.pageY;
        oldDragPosX = e.pageX;
        oldDragPosY = e.pageY;
        dragBtnParent.style.left = dragBtnParent.offsetLeft - dragPosX + "px";
        dragBtnParent.style.top = dragBtnParent.offsetTop - dragPosY + "px";
      }
    });
    window.addEventListener('mouseup', (e) => {
      moved = true;
    });
  }
  function CreateResizePoints(newDiv) {
    let res_se = document.createElement('div');
    res_se.classList.add("resizers");
    res_se.classList.add("se");
    newDiv.appendChild(res_se);
    let res_ne = document.createElement('div');
    res_ne.classList.add("resizers");
    res_ne.classList.add("ne");
    newDiv.appendChild(res_ne);
    let res_sw = document.createElement('div');
    res_sw.classList.add("resizers");
    res_sw.classList.add("sw");
    newDiv.appendChild(res_sw);
    let res_nw = document.createElement('div');
    res_nw.classList.add("resizers");
    res_nw.classList.add("nw");
    newDiv.appendChild(res_nw);
  }
  function ResizeDiv() {
    const resizers = document.querySelectorAll(".resizers");
    let currentResizer, currentDropdown, currentDiv, currentDelete, currentDrag;
    resizers.forEach((resizer) => resizer.addEventListener("mousedown", ResizeMousedown));
  }
  function ResizeMousedown(e) {
    currentResizer = e.target;
    currentDiv = e.target.parentElement;
    currentDropdown = e.target.parentElement.getElementsByClassName("dropdown")[0];
    currentDelete = e.target.parentElement.parentElement.getElementsByClassName("delete-button")[0];
    currentDrag = e.target.parentElement.parentElement.getElementsByClassName("drag-button")[0];
    //console.log(currentDiv);
    isResizing = true;

    let prevX = e.pageX;
    let prevY = e.pageY;

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    function mousemove(e) {
      const divToResize = currentDiv.getBoundingClientRect();

      // console.log(divToResize);
      const initialRight = divToResize.right;
      if (currentResizer.classList.contains("se")) {
        SeResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY, currentDelete, currentDrag);
      }
      else if (currentResizer.classList.contains("sw")) {
        SwResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY);
      }
      else if (currentResizer.classList.contains("ne")) {
        NeResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY, currentDelete, currentDrag);
      }
      else {
        NwResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY, currentDelete, currentDrag);
      }
      prevX = e.pageX;
      prevY = e.pageY;
    }

    function mouseup() {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      isResizing = false;
    }
  }
  function SeResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY, currentDelete, currentDrag) {
    currentDiv.style.width = currentDropdown.style.width = divToResize.width - (prevX - e.pageX) - 2 + "px";
    currentDiv.style.height = currentDropdown.style.height = divToResize.height - (prevY - e.pageY) - 2 + "px";

    currentDelete.style.left = currentDrag.style.left = divToResize.width + 1 + "px";
    currentDelete.style.top = currentDrag.style.top = - 5 + "px";
  }
  function SwResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY) {
    //if(divToResize.left < initialRight){ 
    //console.log(divToResize.left,"l",initialRight,"r");
    currentDiv.style.width = currentDropdown.style.width = divToResize.width + (prevX - e.pageX) - 2 + "px";
    currentDiv.style.height = currentDropdown.style.height = divToResize.height - (prevY - e.pageY) - 2 + "px";
    if (parseInt(currentDiv.style.left)) {
      currentDiv.style.left = parseInt(currentDiv.style.left) - (prevX - e.pageX) + "px";
    }
    else {
      currentDiv.style.left = e.pageX - prevX + "px";
    }
    //}
  }
  function NeResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY, currentDelete, currentDrag) {
    console.log("ne");
    currentDiv.style.width = currentDropdown.style.width = divToResize.width - (prevX - e.pageX) - 2 + "px";
    currentDiv.style.height = currentDropdown.style.height = divToResize.height + (prevY - e.pageY) - 2 + "px";
    if (parseInt(currentDiv.style.top)) {
      currentDiv.style.top = parseInt(currentDiv.style.top) - (prevY - e.pageY) + "px";
    }
    else {
      currentDiv.style.top = e.pageY - prevY + "px";
    }
  }
  function NwResize(e, divToResize, currentDiv, currentDropdown, prevX, prevY, currentDelete, currentDrag) {
    console.log("nw");
    currentDiv.style.width = currentDropdown.style.width = divToResize.width + (prevX - e.pageX) + "px";
    currentDiv.style.height = currentDropdown.style.height = divToResize.height + (prevY - e.pageY) + "px";
    if (parseInt(currentDiv.style.top)) {
      currentDiv.style.top = parseInt(currentDiv.style.top) - (prevY - e.pageY) + "px";
      currentDiv.style.left = parseInt(currentDiv.style.left) - (prevX - e.pageX) + "px";
    }
    else {
      currentDiv.style.top = e.pageY - prevY + "px";
      currentDiv.style.left = e.pageX - prevX + "px";
    }
  }
};

