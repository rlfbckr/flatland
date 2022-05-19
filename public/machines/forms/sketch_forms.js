/*
   form demo
*/

var flatlandConfig = {
    server: "https://flatland.hfk-bremen.de",
    land: 'default',
    updateIntervall: 40,
    spawnIntervall: 100,
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
        if (int(random(2)) == 0) { // flip the coin
            this.setType(MachineType.RECT);
        } else {
            this.setType(MachineType.CIRCLE);
        }
        this.setLifetime(random(0,machineConfig.lifetime));
        this.setSize(random(10, 100));
        this.setFill(random(255), random(255), random(255));
        this.setPenDown();

        this.offset = random(2 * PI);
        this.rad = random(10, width/2);
    }
    move() {
        // how does your machine move 
        this.rotation = noise(this.id * 100, millis() * 0.0001) * 40;
        this.setPosition(cos(this.offset + (millis() * 0.001)) * this.rad,sin(this.offset + (millis() * 0.001)) * this.rad);

    }
    onFinish() {
        // callback function to be called when a bots is about to be killed.
        print("onFinish... bye bye!");
        fill(255,0,0);
        text("BYE BYE", this.pos.x,this.pos.y);
    }
}
// --------------------------------------------------------------




let gui;
let flatland;


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    frameRate(100);
    initSocketIO(flatlandConfig.server);
    gravitation = createVector(0, 0);
}


function draw() {
    flatland.update(); // update + draw flatland
}
