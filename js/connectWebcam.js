export function connectWebcam(videoElement, width, height) {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width, height },
        })
        .then(function (stream) {
          videoElement.srcObject = stream;
        })
        .catch(function (error) {
          console.log("video error: ", error);
        });
    }
  }
  
  /**
  
  // Use this function in app like so:
  import { connectWebcam } from "./js/connectWebcam.js";
  
  const webcamVideo = document.querySelector("#webcamVideo");
  connectWebcam(webcamVideo);
  
   */