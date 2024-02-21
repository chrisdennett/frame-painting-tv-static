export function drawVideoToCanvas(video, canvas) {
    const { videoWidth, videoHeight } = video;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    //   ctx.filter = "invert(100%)";
    //   ctx.globalAlpha = 0.1;
    ctx.drawImage(
      video,
      0,
      0,
      videoWidth,
      videoHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    ctx.restore();
  }