/*
   Corner Machine Demo
*/

var flatlandConfig = {

    server: "http://flatland.earth",
    land: 'default',
    updateIntervall : 10, 
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
        machineConfig.pendown = true;
        this.type = MachineType.LINE;
        this.rotation = (int(random(-4, 4)) * 45);
        this.rotationspeed = random(-0.05, 0.05);
        this.speed = 10;
        this.size = random(2, 10);
        this.step = 20;
    }

    move() {
        // how does your machine move 
        this.color2 = color(
            lerp(machineConfig.color1[0], machineConfig.color2[0], this.getLifetime()),
            lerp(machineConfig.color1[1], machineConfig.color2[1], this.getLifetime()),
            lerp(machineConfig.color1[2], machineConfig.color2[2], this.getLifetime()),
        )
        this.pos.x += cos(this.rotation) * 2;
        this.pos.y += sin(this.rotation) * 2;
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