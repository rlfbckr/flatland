/*
   empty machine example
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'default',
    updateIntervall: 40,
    debug: true,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'forms',
    maxCount: 10,
    minSize: 20,
    maxSize: 30,
    lifetime: 20000000,
    color1: [255, 0, 255],
    color1Opacity: 0.1,
    color2: [0, 255, 255],
    color2Opacity: 0.1,
    pendown: true

}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.type = MachineType.POINT;
        this.size = random(30, 100);
        // this.rad = random(10, 300);
        this.color2 = color(random(255), random(255), random(255));
        //this.penDown();
        this.myown_rotationspeed = random(-0.001,0.001);
        this.myownrandomradius = random(20, 60);
        this.myownvariable_centerx = grid[order].x;
        this.myownvariable_centery = grid[order].y;
        order++;
    }
    move() {
        // how does your machine move 
        this.pos.x = this.myownvariable_centerx + cos(millis() * this.myown_rotationspeed) * this.myownrandomradius;
        this.pos.y = this.myownvariable_centery + sin(millis() * this.myown_rotationspeed) * this.myownrandomradius;
    }
}
// --------------------------------------------------------------








//let socket
let gui;
let flatland;

// own gloaal variables
let order = 0;
var grid = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    let maxpoints = 8; // wieviele punkte
    let margin = 200; // wieviel rand (open, unten, rechts, links)
    for (var y = 0; y < maxpoints; y++) { // für jede zeile
        for (var x = 0; x < maxpoints; x++) { // für jede spalte
            var v = createVector(
                map(x, 0, maxpoints - 1, -(width / 2) + margin, (width / 2) - margin),
                map(y, 0, maxpoints - 1, -(height / 2) + margin, (height / 2) - margin)
            );
            console.log(v.x + ' ' + v.y);
            grid.push(v);
        }
    }
    machineConfig.maxCount = grid.length;
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
    selectLand = guiFlatlandFolder.add(flatlandConfig, 'land', allLands);
    guiFlatlandFolder.add(flatlandConfig, 'debug');
    guiFlatlandFolder.add(flatlandConfig, 'updateIntervall', 1, 250);
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