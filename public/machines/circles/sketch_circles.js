/*
   Circle Machine Demo
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'default',
    updateIntervall: 40,
    debug: false,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.11
}

var machineConfig = {
    name: 'cicles',
    maxCount: 10,
    minSize: 1,
    maxSize: 3,
    lifetime: 10000,
    color1: [250, 0, 0],
    color1Opacity: 1,
    color2: [0, 29, 250],
    color2Opacity: 0.7,
    pendown: true
}

class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        machineConfig.pendown = true;
        this.type = MachineType.LINE;
        this.rotation = random(-80, 90);
        this.size = random(2, 10);
        this.rot = random(-0.3, 0.3);
        this.step = random(5, 15);
    }

    move() {
        // how does your machine move 
        this.color2 = color(
            lerp(machineConfig.color1[0], machineConfig.color2[0], this.getLifetime()),
            lerp(machineConfig.color1[1], machineConfig.color2[1], this.getLifetime()),
            lerp(machineConfig.color1[2], machineConfig.color2[2], this.getLifetime()),
        )
        this.pos.x += cos(this.rotation) * this.step;
        this.pos.y += sin(this.rotation) * this.step;
        this.rotation = this.rotation + this.rot + random(-0.1, 0.1);

    }

}

// --------------------------------------------------------------------

//let socket
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



