//let socket
let gui;
let flatland;

var flatlandConfig = {
    // server: "http://localhost:3000",
    server: "http://flatland.earth",
    land: 'default',
    debug: false,
    clearscreen: false,
    backgroundcolor: [255, 255, 255]
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

class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        machineConfig.pendown = true;
        this.type = MachineType.LINE;
        this.rotation = random(-80, 90)
        this.rotationspeed = random(-0.05, 0.05);
        this.speed = 10;
        this.size = random(2, 10);
        this.rot = random(-0.3, 0.3);
        this.step = random(-10, 10);
    }

    move() {
        // how does your machine move 
        this.color2 = color(
            lerp(machineConfig.color1[0], machineConfig.color2[0], this.getLifetime()),
            lerp(machineConfig.color1[1], machineConfig.color2[1], this.getLifetime()),
            lerp(machineConfig.color1[2], machineConfig.color2[2], this.getLifetime()),
        )


        this.s = 5; //  + noise(millis()) * 2;
        this.pos.x += cos(this.rotation) * (this.step + this.s);
        this.pos.y += sin(this.rotation) * (this.step + this.s);
        // this.size = map(this.age(), 0, machineConfig.lifetime, machineConfig.maxSize, machineConfig.minSize);
        this.rotation = this.rotation + this.rot + random(-0.1, 0.1);

    }

}


function initGui() {
    gui = new dat.GUI();

    let guiFlatlandFolder = gui.addFolder('flatlandConfig');
    guiFlatlandFolder.add(flatlandConfig, 'server');
    guiFlatlandFolder.add(flatlandConfig, 'debug');
    guiFlatlandFolder.addColor(flatlandConfig, 'backgroundcolor');
    guiFlatlandFolder.add(flatlandConfig, 'clearscreen');
    guiFlatlandFolder.open();

    let guiMachineFolder = gui.addFolder("machineConfig");

    guiMachineFolder.add(machineConfig, 'name');
    guiMachineFolder.add(machineConfig, 'maxCount', 1, 100);
    guiMachineFolder.add(machineConfig, "minSize", 1, 200);
    guiMachineFolder.add(machineConfig, "maxSize", 1, 200);
    guiMachineFolder.add(machineConfig, "lifetime", 1, 20000);
    guiMachineFolder.addColor(machineConfig, 'color1');
    guiMachineFolder.add(machineConfig, 'color1Opacity', 0, 1);
    guiMachineFolder.addColor(machineConfig, 'color2');
    guiMachineFolder.add(machineConfig, 'color2Opacity', 0.0, 1.0);
    guiMachineFolder.add(machineConfig, 'pendown');
    guiMachineFolder.open();
}

/*
make p5js responsive 
*/
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}