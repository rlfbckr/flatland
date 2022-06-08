/*
   empty machine example
*/

var flatlandConfig = {
    server: "https://flatland.hfk-bremen.de",
    land: 'default',
    updateIntervall: 40,
    spawnIntervall: 100,
    debug: true,
    clearscreen: false,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'empty-machine-example',
    maxCount: 10,
    minSize: 20,
    maxSize: 30,
    lifetime: 3000,
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
        this.radius =random(100,500);
        this.timeoffset = random(100);
        this.speed = random(0.001,0.01);
        if (int(random(2)) == 1) {
            this.setType(MachineType.CIRCLE); // make bot a rectangle
        } else {
            this.setType(MachineType.RECT); // make bot a rectangle

        }
        this.setFill(random(255), random(255), random(255));
        this.setStroke(0, 0, 0);
        this.setRotation(random(100)); // rotate bot 45 degree
        this.setPosition(random(-500, 500), random(-500, 500)); // go to random pos;
    }
    move() {
        // how does your machine move 
//        this.setPosition(this.pos.x + random(-1, 1), this.pos.y + random(-1, 1));
        this.setPosition(sin(this.timeoffset+millis()*this.speed)*this.radius,cos(this.timeoffset+millis()*this.speed)*this.radius);
    }
}
// --------------------------------------------------------------


// -- p5.js code ----
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
