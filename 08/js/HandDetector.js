import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import EventEmitter from "@onemorestudio/eventemitterjs";

export default class HandDetector extends EventEmitter {
  constructor(videoElement) {
    super();
    this.videoElement = videoElement;
    console.log("HandDetector.js");
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.finger = { x: null, y: null };
    this.createHandLandmarker();
  }

  async createHandLandmarker() {
    const vision = await FilesetResolver.forVisionTasks("./public/wasm");

    this._handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `./tasks/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO", // this.runningMode,
      numHands: 2,
    });

    // this.detect();
    this.emit("ready", []);
  }

  detect() {
    let startTimeMs = performance.now();
    const results = this._handLandmarker.detectForVideo(
      this.videoElement,
      startTimeMs
    );
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Resetting finger positions
    this.fingers = [{ x: null, y: null }, { x: null, y: null }]; // Index 0 is left hand, index 1 is right hand

    if (results.landmarks.length > 0) {
      results.landmarks.forEach((hand, index) => {
        if (index < 2) { // Limit to two hands
          drawLandmarks(this.ctx, hand, { color: "red", radius: 5 });
          // Store the coordinates of the index finger of each hand
          this.fingers[index] = hand[8];
        }
      });
    }
  }
}
