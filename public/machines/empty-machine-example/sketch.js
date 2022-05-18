/*
   empty machine example
*/

var flatlandConfig = {
    server: "https://flatland.hfk-bremen.de",
    land: 'default',
    updateIntervall: 40,
    spawnIntervall: 100,
    debug: true,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'empty-machine-example',
    maxCount: 1,
    minSize: 20,
    maxSize: 30,
    lifetime: 1000,
    color1: [255, 0, 255],
    color1Opacity: 1,
    color2: [0, 0, 0],
    color2Opacity: 1,
    pendown: false
}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.setType(MachineType.RECT); // make bot a rectangle
        this.setFill(255,255,255);
        this.setStroke(0,0,255);
        this.setRotation(PI/4); // rotate bot 45 degree
        this.setPosition(random(-100,100),random(-100,100)); // go to random pos;
    }
    move() {
        // how does your machine move 
        this.setPosition(this.pos.x+random(-2,2),this.pos.y+random(-2,2));
    }
}
// --------------------------------------------------------------



let gui;
let flatland;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    initSocketIO(flatlandConfig.server);
}

function draw() {
    flatland.update(); // update + draw flatland
}
