/*
   Brownian.dot Machine Demo
*/


var flatlandConfig = {
    // server: "http://localhost:3000",
    server: "https://flatland.earth",
    land: 'default',
    debug: true,
    presenter: true,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'presenter',
    maxCount: 0,
    minSize: 20,
    maxSize: 30,
    lifetime: 20000,
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
        this.type = MachineType.CIRCLE;
    }
    move() {
        // how does your machine move 
    }
}
// --------------------------------------------------------------


//let socket
let gui;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
   // gui.hide();
    flatlandConfig.debug = false;
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
    selectLand = guiFlatlandFolder.add(flatlandConfig, 'land',allLands);
    guiFlatlandFolder.add(flatlandConfig, 'debug');
    guiFlatlandFolder.addColor(flatlandConfig, 'backgroundcolor');
    guiFlatlandFolder.add(flatlandConfig, 'backgroundblend', 0.0, 1.0);
    guiFlatlandFolder.add(flatlandConfig, 'clearscreen');
    guiFlatlandFolder.open();
    selectLand.setValue(flatlandConfig.land);

}

/*
make p5js responsive 
*/
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


