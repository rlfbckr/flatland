/*
   empty machine example
*/

var flatlandConfig = {
  server: "https://flatland.hfk-bremen.de",
  land: 'default',
  updateIntervall: 40,
  spawnIntervall: 10,
  debug: true,
  clearscreen: true,
  backgroundcolor: [255, 255, 255],
  backgroundblend: 0.6
}

var machineConfig = {
  name: 'empty-machine-example',
  maxCount: 25,
  minSize: 10,
  maxSize: 70,
  lifetime: 10000,
  color1: [255, 0, 255],
  color1Opacity: 1,
  color2: [0, 0, 0],
  color2Opacity: 1,
  pendown: true
}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
  setup() {
    // initialize your machine


    this.a = random(100);
    this.r = random(10, 100);
    this.s = random(-0.1, 0.1);
    //d this.setPenDown();
    this.psize = random(5, 20);
  }
  move() {

    if (machineConfig.pendown) {
      this.setPenDown();
    } else {
      this.setPenUp();
    }
    this.setFill(0, 0, 0);
    this.setPosition(nasex + this.xoff, nasey + this.yoff);
    this.setSize(this.psize);
    this.xoff = sin(this.a) * this.r; //  this.xoff+ random(-1,1);
    this.yoff = cos(this.a) * this.r; //  this.yoff +random(-1,1);
    // this.psize = this.psize+random(-1,1);
    this.a = this.a + this.s;

  }
}
// --------------------------------------------------------------


// -- p5.js code ----
let gui;
let flatland;


let video;
let poseNet;
let poses = [];
let nasex = 0;
let nasey = 0;
let show_video = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  flatland = new Flatland(); // connect to the flatland server
  initGui();
  initSocketIO(flatlandConfig.server);

  video = createCapture(VIDEO);
  video.size(320, 240);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function draw() {
  show_video = flatlandConfig.debug;
  flatland.update(); // update + draw flatland
  if (show_video) {
    image(video, -width / 2, -height / 2, width, height);
  }
  if (poses.length > 0) {
    let pose = poses[0].pose;

    // Create a pink ellipse for the nose
    fill(213, 0, 143);
    let nose = pose['nose'];
     nasex = map(nose.x, 0, 320, -width / 2, width / 2) ;
    nasey =  map(nose.y, 0, 240, -height / 2, height / 2) ;
    if (show_video) {
      ellipse(map(nose.x, 0, 320, -width / 2, width / 2), map(nose.y, 0, 240, -height / 2, height / 2), 20, 20);
    }
  }
  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
  //drawSkeleton();

}

function modelReady() {
  select('#status').html('Model Loaded');
}


function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(-width / 2 + keypoint.position.x, -height / 2 + keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected

  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(-width / 2 + partA.position.x, -height / 2 + partA.position.y, -width / 2 + partB.position.x, -height / 2 + partB.position.y);
    }
  }
}