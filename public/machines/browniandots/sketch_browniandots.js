/*
   Brownian.dot Machine Demo
*/

var flatlandConfig = {
    // server: "http://localhost:3000",
    server: "http://flatland.earth",
    land: 'default',
    debug: true,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'browniandots',
    maxCount: 10,
    minSize: 20,
    maxSize: 150,
    lifetime: 10000,
    color1: [0, 0, 255],
    color1Opacity: 0.1,
    color2: [255, 255, 255],
    color2Opacity: 0.1,
    pendown: true

}

class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        machineConfig.pendown = true;
        this.type = MachineType.CIRCLE;
        this.rotationspeed = random(-0.05, 0.05);
        this.speed = 10;
    }
    move() {
        // how does your machine move 
        this.color1 = color(
            lerp(machineConfig.color2[0], machineConfig.color1[0], this.getLifetime()),
            lerp(machineConfig.color2[1], machineConfig.color1[1], this.getLifetime()),
            lerp(machineConfig.color2[2], machineConfig.color1[2], this.getLifetime()),
        )
        this.color2 = color(255, 255, 255);

        this.rotation += this.rotationspeed;
        this.pos.x += random(-this.speed, this.speed);
        this.pos.y += random(-this.speed, this.speed);
        this.size = map(this.age(), 0, machineConfig.lifetime, machineConfig.maxSize, machineConfig.minSize);

    }

}
// --------------------------------------------------------------
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



function initGui() {
    gui = new dat.GUI();

    let guiFlatlandFolder = gui.addFolder('flatlandConfig');
    guiFlatlandFolder.add(flatlandConfig, 'server');
    guiFlatlandFolder.add(flatlandConfig, 'debug');
    guiFlatlandFolder.addColor(flatlandConfig, 'backgroundcolor');
    guiFlatlandFolder.add(flatlandConfig, 'backgroundblend', 0.0, 1.0);
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