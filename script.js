

const addStuffToContents = () => {

//   	// Get canvas and context
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// // Set canvas size
// canvas.width = window.innerWidth - 40;
// canvas.height = window.innerHeight - 200;


// // Set default brush color and size
// let brushColor = '#000';
// let brushSize = 10;

// // Set eraser mode to false initially
// let isEraser = false;

// // Set up event listeners for mouse and touch events
// let isDrawing = false;
// let lastX = 0;
// let lastY = 0;

// canvas.addEventListener('mousedown', startDrawing);
// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mouseup', stopDrawing);
// canvas.addEventListener('touchstart', startDrawing);
// canvas.addEventListener('touchmove', draw);
// canvas.addEventListener('touchend', stopDrawing);


// // Start drawing
// function startDrawing(e) {
//   isDrawing = true;
//   [lastX, lastY] = getMousePosition(e);
// }

// // Draw
// function draw(e) {
//   if (!isDrawing) return;
//   const [x, y] = getMousePosition(e);
//   ctx.strokeStyle = isEraser ? '#fff' : brushColor;
//   ctx.lineWidth = brushSize;
//   ctx.lineJoin = 'round';
//   ctx.lineCap = 'round';
//   ctx.beginPath();
//   ctx.moveTo(lastX, lastY);
//   ctx.lineTo(x, y);
//   ctx.stroke();
//   [lastX, lastY] = [x, y];
// }

// // Stop drawing
// function stopDrawing() {
//   isDrawing = false;
// }

// // Get mouse position relative to canvas
// function getMousePosition(e) {
//   const rect = canvas.getBoundingClientRect();
//   const mouseX = e.clientX || e.touches[0].clientX;
//   const mouseY = e.clientY || e.touches[0].clientY;
//   return [mouseX - rect.left, mouseY - rect.top];
// }

// // Handle color picker input
// const colorPicker = document.getElementById('color-picker');
// colorPicker.addEventListener('input', () => {
//   brushColor = colorPicker.value;
// });

// // Handle brush size input
// const brushSizeInput = document.getElementById('brush-size');
// brushSizeInput.addEventListener('input', () => {
//   brushSize = brushSizeInput.value;
// });

// // Handle eraser button click
// const eraserButton = document.getElementById('eraser-button');
// eraserButton.addEventListener('click', () => {
//   isEraser = !isEraser;
//   if (isEraser) {
//     eraserButton.classList.add('active');
//     canvas.classList.add('eraser-active');
//     canvas.style.cursor = 'url(eraser.svg), auto';
//   } else {
//     eraserButton.classList.remove('active');
//     canvas.classList.remove('eraser-active');
//     canvas.style.cursor = 'auto';
//   }
// });

// // Handle clear button click
// const clearButton = document.getElementById('clear-button');
// clearButton.addEventListener('click', () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// });

};

// const zoomUpdate = () => {
// 	const matrix = `matrix(${translate.scale},0,0,${translate.scale},${translate.translateX},${translate.translateY})`;
// 	contents.style.transform = matrix;
//   };

const grid = document.querySelector('.grid');
const contents = document.querySelector('.contents');
const gridSize = grid.getBoundingClientRect();

let panningAllowed = false;
let zoomFactor = 1;

const translate = { scale: zoomFactor, translateX:0, translateY:0 };
const initialContentsPos = { x:0, y:0 };
const initialZoomPos = { x:0, y:0 };
const pinnedMousePosition = { x:0, y:0 };
const mousePosition = { x:0, y:0 };

const mousedown = (event) => {
	initialContentsPos.x = translate.translateX;
	initialContentsPos.y = translate.translateY;
	pinnedMousePosition.x = event.clientX;
	pinnedMousePosition.y = event.clientY;
	panningAllowed = true;
};

const mousemove = (event) => {
	mousePosition.x = event.clientX;
	mousePosition.y = event.clientY;
	if (panningAllowed) {
		  const diffX = (mousePosition.x - pinnedMousePosition.x);
      const diffY = (mousePosition.y - pinnedMousePosition.y);
      translate.translateX = initialContentsPos.x + diffX;
      translate.translateY = initialContentsPos.y + diffY;
	}
	update();
};

const mouseup = (event) => {
	panningAllowed = false;
};

const zoom = (event) => {
    // Determine before anything else. Otherwise weird jumping.
    if (zoomFactor + (event.deltaY / 5000) > 6 || 
        zoomFactor + (event.deltaY / 5000) < .01
       ) {
      return;
    }

    const oldZoomFactor = zoomFactor; 
	  zoomFactor += (event.deltaY / 5000);

    mousePosition.x = event.clientX - gridSize.x;
	  mousePosition.y = event.clientY - gridSize.y;

    // Calculations
  	translate.scale = zoomFactor;

    const contentMousePosX = (mousePosition.x - translate.translateX);
    const contentMousePosY = (mousePosition.y - translate.translateY);  
    const x = mousePosition.x - (contentMousePosX * (zoomFactor / oldZoomFactor));
    const y = mousePosition.y - (contentMousePosY * (zoomFactor / oldZoomFactor));
  
	  translate.translateX = x;
   	translate.translateY = y;

    update();
};

const update = () => {
  const matrix = `matrix(${translate.scale},0,0,${translate.scale},${translate.translateX},${translate.translateY})`;
  contents.style.transform = matrix;
};

addStuffToContents();
grid.addEventListener('wheel', zoom);
grid.addEventListener('mousedown', mousedown);
grid.addEventListener('mousemove', mousemove);
grid.addEventListener('mouseup', mouseup);


