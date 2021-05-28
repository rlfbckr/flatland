/*
   Brownian.dot Machine Demo
*/

var flatlandConfig = {
    // server: "http://localhost:3000",
    server: "http://flatland.earth",
    land: 'default',
    updateIntervall : 10, 
    debug: true,
    clearscreen: true,
    backgroundcolor: [255, 255, 255],
    backgroundblend: 0.5
}

var machineConfig = {
    name: 'bouncingballs',
    maxCount: 4,
    minSize: 20,
    maxSize: 30,
    lifetime: 20000,
    color1: [255, 0, 255],
    color1Opacity: 0.1,
    color2: [0, 255, 255],
    color2Opacity: 0.1,
    pendown: true
}

let gravitation;
let friction = 0.7;
let lastspawn = 0;

class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        machineConfig.pendown = true;
        this.type = MachineType.CIRCLE;
        this.rotationspeed = random(-0.05, 0.05);
        this.speed = 10;
        this.velocity = createVector(random(-5, 5), random(-5, 5));
        this.color1 = color(machineConfig.color1[0], machineConfig.color1[1], machineConfig.color1[2]);
    }
    move() {

        // local bounce
        for (let i = 0; i < flatland.machinesLocal.length; i++) {
            if (this != flatland.machinesLocal[i]) {
                let distance = dist(this.pos.x, this.pos.y, flatland.machinesLocal[i].pos.x, flatland.machinesLocal[i].pos.y);
                let minimale_distance = ((this.size / 2) + (flatland.machinesLocal[i].size / 2));
                if (distance <= minimale_distance) {
                    let dx = flatland.machinesLocal[i].pos.x - this.pos.x;
                    let dy = flatland.machinesLocal[i].pos.y - this.pos.y;
                    let a = atan2(dy, dx);
                    this.velocity.mult(-1);
                    flatland.machinesLocal[i].velocity.mult(-1);
                    let tx = this.pos.x + cos(a) * (minimale_distance * 1.1);
                    let ty = this.pos.y + sin(a) * (minimale_distance * 1.1);
                    flatland.machinesLocal[i].pos.x = tx;
                    flatland.machinesLocal[i].pos.y = ty;
                    // this.color1 = color(random(255), random(255), random(255));

                }
            }

        }
        // remote bounce
        for (let i = 0; i < flatland.machinesRemote.length; i++) {
            let distance = dist(this.pos.x, this.pos.y, flatland.machinesRemote[i].pos.x, flatland.machinesRemote[i].pos.y);
            let minimale_distance = ((this.size / 2) + (flatland.machinesRemote[i].size / 2));
            if (distance <= minimale_distance) {
                this.velocity.mult(-1);
                this.pos.x = this.pos.x + random(-100, 100);
                this.pos.y = this.pos.y + random(-100, 100);
                this.color1 = color(random(255), random(255), random(255));

            }

        }


        // how does your machine move 
        /*
        this.color1 = color(
                lerp(machineConfig.color2[0], machineConfig.color1[0], this.getLifetime()),
                lerp(machineConfig.color2[1], machineConfig.color1[1], this.getLifetime()),
                lerp(machineConfig.color2[2], machineConfig.color1[2], this.getLifetime()),
            )
            // this.color2 = color(255, 255, 255);
            */
        this.velocity.add(gravitation);
        this.pos.add(this.velocity);

        // einfallswinkel = ausfallswinkel
        if ((this.pos.x - this.size / 2) <= (-width / 2)) {
            this.pos.x = (-width / 2) + (this.size / 2);
            this.velocity.x *= -friction;
        }
        if ((this.pos.x + this.size / 2) >= (width / 2)) {
            this.pos.x = (width / 2) - (this.size / 2);
            this.velocity.x *= -friction;
        }
        if ((this.pos.y - this.size / 2) <= (-height / 2)) {
            this.pos.y = (-height / 2) + (this.size / 2);
            this.velocity.y *= -friction;
        }
        if ((this.pos.y + this.size / 2) >= (height / 2)) {
            this.pos.y = (height / 2) - (this.size / 2);
            this.velocity.y *= -friction;

        }
    }

}
// --------------------------------------------------------------
//let socket
let gui;
let flatland;

// let osc, playing, freq, amp;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    frameRate(100);
    initSocketIO(flatlandConfig.server);
    gravitation = createVector(0, 0);
    /*
    osc = new p5.Oscillator('sine');
    osc.start();
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.6);
    */
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