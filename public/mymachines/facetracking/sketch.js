/*
   empty machine example
*/

var flatlandConfig = {
    server: "https://flatland.hfk-bremen.de",
    land: 'default',
    updateIntervall: 40,
    spawnIntervall: 10,
    debug: true,
    clearscreen: false,
    backgroundcolor: [0,0,0],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'empty-machine-example',
    maxCount: 5,
    minSize: 10,
    maxSize: 70,
    lifetime: 1000,
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

        this.xpblabla = random(-width / 2, width / 2);
        this.ypblabla = random(-height / 2, height / 2);
       //d this.setPenDown();
    }
    move() {
        
        if (machineConfig.pendown) {
            this.setPenDown();
        } else {
            this.setPenUp();
        }
        this.setFill(255,0,0);
        this.setPosition(nasex, nasey);
        this.setSize(map(this.getLifetime(),0,1,machineConfig.maxSize,machineConfig.minSize));

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
    poseNet.on('pose', function(results) {
      poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();
}

function draw() {
    image(video, -width/2, -height/2, 320,240);
    if (poses.length > 0) {
        let pose = poses[0].pose;
    
        // Create a pink ellipse for the nose
        fill(213, 0, 143);
        let nose = pose['nose'];
        nasex = map(nose.x,0,320,-width/2,width/2);
        nasey = map(nose.y,0,320,-height/2,height/2);
        ellipse(-width/2+nose.x, -height/2+nose.y, 20, 20);
      }
    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    drawSkeleton();
    flatland.update(); // update + draw flatland
}

function modelReady() {
    select('#status').html('Model Loaded');
  }

  
function drawKeypoints()  {
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
          ellipse(-width/2+keypoint.position.x, -height/2+keypoint.position.y, 10, 10);
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
        line(-width/2+partA.position.x, -height/2+partA.position.y, -width/2+partB.position.x, -height/2+partB.position.y);
      }
    }
  }