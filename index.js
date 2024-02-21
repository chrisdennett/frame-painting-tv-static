import { connectWebcam } from "./js/connectWebcam.js";
import { drawVideoToCanvas } from "./js/drawVideoToCanvas.js";

const webcamVideo = document.querySelector("#webcamVideo");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// Settings
const webcamSize = { w: 320, h: 240 };

// Setup
canvas.width = 800;
canvas.height = 600;

const smallCanvas = document.querySelector("#smallCanvas");
smallCanvas.width = 320;
smallCanvas.height = 240;
const smallCtx = smallCanvas.getContext("2d", { willReadFrequently: true });

let preFrameData = null;

connectWebcam(webcamVideo, webcamSize.w, webcamSize.h);
loop();

// Loop
function loop() {
  drawVideoToCanvas(webcamVideo, smallCanvas);

  ctx.drawImage(
    smallCanvas,
    0,
    0,
    smallCanvas.width,
    smallCanvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const imgData = smallCtx.getImageData(
    0,
    0,
    smallCanvas.width,
    smallCanvas.height
  );
  const imgDataCopy = smallCtx.getImageData(
    0,
    0,
    smallCanvas.width,
    smallCanvas.height
  );
  const data = imgData.data;

  // for every row
  for (let y = 0; y < smallCanvas.height; y++) {
    // for every pixel in the row
    for (let x = 0; x < smallCanvas.width; x++) {
      // Calculate the index of the current pixel in the image data array
      const i = (y * smallCanvas.width + x) * 4;

      // Access the RGBA values of the pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

        if(preFrameData){
            const prevR = preFrameData[i];
            const prevG = preFrameData[i + 1];
            const prevB = preFrameData[i + 2];
            
            imgData.data[i] = prevR - r;
            imgData.data[i +1] = prevG - g;
            imgData.data[i+2] = prevB - b;
        }
    }
  }

  preFrameData = imgDataCopy.data;
  smallCtx.putImageData(imgData, 0, 0)


  window.requestAnimationFrame(loop);
}
