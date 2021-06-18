/*
   global grid example
*/

var flatlandConfig = {
    server: "https://flatland.earth",
    land: 'testland',
    updateIntervall: 30,
    debug: false,
    clearscreen: false,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'grid',
    maxCount: 10,
    minSize: 20,
    maxSize: 30,
    lifetime: 10000, // forever...!
    color1: [255, 0, 255],
    color1Opacity: 0.1,
    color2: [0, 255, 255],
    color2Opacity: 0.1,
    pendown: false
}



// ---------------------------------------------------------------
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.setType(MachineType.POINT);
        this.setSize(random(0, 100));
        this.setLifetime(random(0,machineConfig.lifetime));
        this.setStroke(random(255), random(255), random(255),128);
        this.setFill(random(255), random(255), random(255),128);
        this.setPenDown();
        //this.penDown();
        this.myown_rotationspeed = random(-0.001,0.001);
        this.myownrandomradius =  random(20, 60);
        var randomindex = int(random(grid.length));
        this.myownvariable_centerx = grid[index].x;
        this.myownvariable_centery = grid[index].y;
        index = (index + 1) % grid.length;
    }
    move() {
        // how does your machine move 
        this.setPosition(this.myownvariable_centerx + cos(millis() * this.myown_rotationspeed) * this.myownrandomradius, this.myownvariable_centery + sin(millis() * this.myown_rotationspeed) * this.myownrandomradius);
    }
}
// --------------------------------------------------------------



let gui;
let flatland;

// my own  gloabal variables
let index = 0;
let grid = [];
let maxpoints = 6; // wieviele punkte
let margin = 200; // wieviel rand (open, unten, rechts, links)

// local stuff
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
   // create a global grid 
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
    initSocketIO(flatlandConfig.server);
}

function draw() {
    flatland.update(); // update + draw flatland
}

