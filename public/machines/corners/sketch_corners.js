/*
   Corner Machine Demo
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'default',
    updateIntervall: 40,
    spawnIntervall: 100,
    debug: true,
    clearscreen: false,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'cicles',
    maxCount: 2,
    minSize: 1,
    maxSize: 1,
    lifetime: 5000,
    color1: [255, 255, 0],
    color1Opacity: 0.5,
    color2: [255, 0, 255],
    color2Opacity: 0.5,
    pendown: true
}


class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.setPenDown();
        this.setType(MachineType.LINE);
        this.setSize(random(2, 10));

        this.rotation = (int(random(-4, 4)) * 45);
        this.rotationspeed = random(-0.05, 0.05);
        this.speed = 10;
        this.step = 20;
    }

    move() {
        // how does your machine move 
        this.setStroke(
            lerp(machineConfig.color1[0], machineConfig.color2[0], this.getLifetime()),
            lerp(machineConfig.color1[1], machineConfig.color2[1], this.getLifetime()),
            lerp(machineConfig.color1[2], machineConfig.color2[2], this.getLifetime()),
        );
        this.setPosition(this.pos.x + cos(this.rotation) * 2,this.pos.y + sin(this.rotation) * 2);
        if (int(random(20) <= 1)) {
            this.rotation = this.rotation + (int(random(-2, 2)) * 45);
        }
    }
}

// ------------------------------------------------------------------
//let socket
let gui;
let flatland;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    frameRate(100);
    initSocketIO(flatlandConfig.server);
}


function draw() {
    flatland.update(); // update + draw flatland
}
