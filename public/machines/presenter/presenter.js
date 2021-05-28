/*
   Brownian.dot Machine Demo
*/

var flatlandConfig = {
    // server: "http://localhost:3000",
    server: "http://flatland.earth",
    land: 'default',
    debug: false,
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

        /*
        for (remotemachine of flatland.machinesRemote) {
            if (dist(this.pos.x, this.pos.y, remotemachine.pos.x, remotemachine.pos.y) < 100) {
                // mir kommt ein fremder bot zu nahme. ich haue ab
                this.pos.x = this.pos.x + random(-100, 100);
                this.pos.y = this.pos.y + random(-100, 100);
            }

        }
        */
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
    gui.hide();
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
    guiFlatlandFolder.add(flatlandConfig, 'debug');
    guiFlatlandFolder.addColor(flatlandConfig, 'backgroundcolor');
    guiFlatlandFolder.add(flatlandConfig, 'backgroundblend', 0.0, 1.0);
    guiFlatlandFolder.add(flatlandConfig, 'clearscreen');
    guiFlatlandFolder.open();


}

/*
make p5js responsive 
*/
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}