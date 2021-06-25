/*
   typo swarm
*/

var flatlandConfig = {
    server: "https://flatland.earth", 
    land: 'default',
    updateIntervall: 40,
    spawnIntervall: 100,
    debug: false,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.02
}

var machineConfig = {
    name: 'empty-machine-example',
    maxCount: 10,
    minSize: 20,
    maxSize: 30,
    lifetime: 20000,
    color1: [0, 0, 0],
    color1Opacity: 0.5,
    color2: [0, 0, 0],
    color2Opacity: 0.9,
    pendown: true
}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.setType(MachineType.POINT);
        this.setPosition(random(-width / 2, width / 2),random(-height / 2, height / 2));
        this.target = points[mapper];
        mapper = (mapper + 1) % points.length;
    }
    move() {
        // how does your machine move 
        this.setPosition((this.pos.x * 0.97) + (this.target.x * 0.03), (this.pos.y * 0.97) + (this.target.y * 0.03));
        this.setSize(map(dist(this.pos.x, this.pos.y, this.target.x, this.target.y), width / 2, 0, 200, 5));
    }
}
// --------------------------------------------------------------




// global p5 stuff
let gui;
let flatland;

let typo;
let points;
let bounds;
let mapper = 0;

function preload() {
    typo = loadFont('../../assets/fonts/RobotoMono-Regular.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textAlign(CENTER, CENTER);
    points = typo.textToPoints('flatland', 0, 0, 200, {
        sampleFactor: 0.02,
        simplifyThreshold: 0
    });

    for (let i = 0; i < points.length; i++) {
        points[i].x = points[i].x - width / 3;
        points[i].y = points[i].y;

    }
    machineConfig.maxCount = points.length;

    flatland = new Flatland(); // connect to the flatland server
    initGui();
    initSocketIO(flatlandConfig.server);
}


function draw() {
    flatland.update(); // update + draw flatland
}
