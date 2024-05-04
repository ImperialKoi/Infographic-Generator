const canvas = document.getElementById('infographicCanvas');
const ctx = canvas.getContext('2d');
const backgroundColorPicker = document.getElementById('backgroundColorPicker');
const textBoxColorPicker = document.getElementById('textBoxColorPicker'); // New color picker for text boxes
let images = [];
let textInputs = [];
let selectedElement = null;
let resizeHandleSize = 12; // Size of the resize handles
let canvasBackgroundColor = '#ffffff';

backgroundColorPicker.addEventListener('input', () => {
  canvasBackgroundColor = backgroundColorPicker.value;
  drawInfographic(document.getElementById('templateSelect').value);
});

function generateInfographic() {
  const template = document.getElementById('templateSelect').value;
  const imageFiles = document.getElementById('imageInput').files;

  const loadImagePromises = [];
  const newImages = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const reader = new FileReader();
    const loadImagePromise = new Promise((resolve, reject) => {
      reader.onload = function(event) {
        const imageData = event.target.result;
        const imageObj = new Image();
        imageObj.onload = function() {
          newImages.push({ obj: imageObj, x: 50, y: 50, width: 200, height: 150, rotationAngle: 0 });
          resolve();
        };
        imageObj.src = imageData;
      };
      reader.readAsDataURL(imageFiles[i]);
    });
    loadImagePromises.push(loadImagePromise);
  }
  
  Promise.all(loadImagePromises).then(() => {
    images = images.concat(newImages);
    drawInfographic(template);
  });

  if (imageFiles.length === 0) {
    drawInfographic(template);
  }
}

backgroundColorPicker.addEventListener('input', () => {
  console.log('Background color changed:', backgroundColorPicker.value);
  canvasBackgroundColor = backgroundColorPicker.value;
  drawInfographic(document.getElementById('templateSelect').value);
});

function drawTemplate1() {
  // Draw background or base design
  ctx.fillStyle = canvasBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  ctx.fillStyle = '#000000';
  ctx.font = '24px Arial';
  wrapText(ctx, "", 50, 50, canvas.width - 100, 30);
}

function drawInfographic(template) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas background color
  ctx.fillStyle = canvasBackgroundColor;

  // Draw background or base design
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  ctx.fillStyle = '#000000';
  ctx.font = '24px Arial';
  wrapText(ctx, "", 50, 50, canvas.width - 100, 30);

  // Draw text boxes
  textInputs.forEach(input => {
    ctx.fillStyle = input.backgroundColor; // Use individual background color for text box
    ctx.fillRect(input.x, input.y, input.width, input.height);
    ctx.fillStyle = '#000000';
    ctx.font = `${input.height / 2}px Arial`;
    ctx.fillText(input.text, input.x + 5, input.y + input.height - 5);
  });

  // Draw images
  images.forEach(image => {
    ctx.save();
    ctx.translate(image.x + image.width / 2, image.y + image.height / 2);
    ctx.rotate(image.rotationAngle * Math.PI / 180);
    ctx.drawImage(image.obj, -image.width / 2, -image.height / 2, image.width, image.height);
    ctx.restore();

    if (selectedElement === image) {
      drawResizeHandles(image.x, image.y, image.width, image.height);
    }
  });
}

function drawResizeHandles(x, y, width, height) {
  ctx.strokeStyle = 'blue'; // Set stroke style to blue
  ctx.lineWidth = 2; // Set line width for handles
  ctx.strokeRect(x - resizeHandleSize, y - resizeHandleSize, resizeHandleSize * 2, resizeHandleSize * 2);
  ctx.strokeRect(x + width - resizeHandleSize, y - resizeHandleSize, resizeHandleSize * 2, resizeHandleSize * 2);
  ctx.strokeRect(x - resizeHandleSize, y + height - resizeHandleSize, resizeHandleSize * 2, resizeHandleSize * 2);
  ctx.strokeRect(x + width - resizeHandleSize, y + height - resizeHandleSize, resizeHandleSize * 2, resizeHandleSize * 2);
}

// Handle setting background color for selected text box
function setTextBoxColor() {
  if (selectedElement && !selectedElement.obj) { // Check if selected element is a text box
    selectedElement.backgroundColor = textBoxColorPicker.value; // Set background color for selected text box
    drawInfographic(document.getElementById('templateSelect').value);
  }
}

// Initial canvas setup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Generate initial infographic
generateInfographic();

// Event listener for text box color picker
textBoxColorPicker.addEventListener('input', setTextBoxColor);