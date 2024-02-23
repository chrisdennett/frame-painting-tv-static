import { connectWebcam } from "./js/connectWebcam.js";
import { initControls } from "./js/controls.js";
import { drawVideoToCanvas } from "./js/drawVideoToCanvas.js";

const webcamVideo = document.querySelector("#webcamVideo");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// Settings
const webcamSize = { w: 1280, h: 720 };
const controls = document.querySelector("#controls");
const params = initControls(controls);

// Setup
canvas.width = 1280;
canvas.height = 720;

const smallCanvas = document.querySelector("#smallCanvas");
const staticCanvas = document.querySelector("#staticCanvas");
smallCanvas.width = staticCanvas.width = 1280;
smallCanvas.height = staticCanvas.height = 720;

const smallCtx = smallCanvas.getContext("2d", { willReadFrequently: true });
const staticCtx = staticCanvas.getContext("2d", { willReadFrequently: true });
let preFrameData = null;

fillCanvasWithRandomStatic(staticCanvas)

connectWebcam(webcamVideo, webcamSize.w, webcamSize.h);
loop();

// Loop
function loop() {
  drawVideoToCanvas(webcamVideo, smallCanvas);

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
  const tvImgData = staticCtx.getImageData(
    0,
    0,
    staticCanvas.width,
    staticCanvas.height
  );
//   const data = imgData.data;

  // for every row
  for (let i = 0; i < imgDataCopy.data.length; i+=4) {

      // Access the RGBA values of the pixel
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];

        if(preFrameData){
            const prevR = preFrameData[i];
            const prevG = preFrameData[i + 1];
            const prevB = preFrameData[i + 2];

            const diff = (r+g+b) - (prevR+prevG+prevB);
            
            const changeMeetsThreshold = diff > params.threshold;
            const val = changeMeetsThreshold ? 255 : 0;
            // imgData.data[i] = val;
            // imgData.data[i +1] = val;
            // imgData.data[i+2] = val;

            // only show the values that haven't changed
            if(changeMeetsThreshold){
                tvImgData.data[i] = r - prevR;
                tvImgData.data[i+1] = g - prevG;
                tvImgData.data[i+2] = b - prevB;
            }
            else{
              tvImgData.data[i] = 255;
                tvImgData.data[i+1] = 255;
                tvImgData.data[i+2] = 255;
            }


            // adjust the same pixel within the static if meets the threshold
            // if(changeMeetsThreshold){
            //     const isWhite = tvImgData.data[i] === 255;
            //     const flipValue = isWhite ? 0 : 255;
            //     tvImgData.data[i] = flipValue;
            //     tvImgData.data[i+1] = flipValue;
            //     tvImgData.data[i+2] = flipValue;
            // }

            // if(changeMeetsThreshold && i+7 < imgDataCopy.data.length){
            //   tvImgData.data[i + 5] = 255;
            //   tvImgData.data[i + 6] = val;
            //   tvImgData.data[i + 7] = 255;
            // }
        }
  }

  preFrameData = imgDataCopy.data;
  smallCtx.putImageData(imgData, 0, 0);
  staticCtx.putImageData(tvImgData, 0, 0);

  ctx.drawImage(
    staticCanvas,
    0,
    0,
    staticCanvas.width,
    staticCanvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  window.requestAnimationFrame(loop);
}


function fillCanvasWithRandomStatic(canvas){
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0,0,canvas.width, canvas.height)
    const imgData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
    
      // for every row
      for (let y = 0; y < canvas.height; y++) {
        // for every pixel in the row
        for (let x = 0; x < canvas.width; x++) {
            // Calculate the index of the current pixel in the image data array
            const i = (y * canvas.width + x) * 4;
            const val = Math.random() >= 0.5 ? 255 : 0;
            imgData.data[i] = val;
            imgData.data[i +1] = val;
            imgData.data[i+2] = val;
        }
      }
    
      ctx.putImageData(imgData, 0, 0);
}
