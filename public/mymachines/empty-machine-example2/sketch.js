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
    maxCount: 30,
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
      //  this.setType(MachineType.RECT);
        this.cr = random(255);
        this.cg = random(255);
        this.cb = random(255);
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
        this.setFill(this.cr*this.getLifetime(),this.cg*this.getLifetime(),this.cb*this.getLifetime());
        this.setStroke(this.cr*this.getLifetime(),this.cg*this.getLifetime(),this.cb*this.getLifetime());
        this.xpblabla = this.xpblabla + random(-2, 2);
        this.ypblabla = this.ypblabla + random(-2, 2);
        this.setPosition(this.xpblabla, this.ypblabla);
        this.setSize(map(this.getLifetime(),0,1,machineConfig.maxSize,machineConfig.minSize));

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
