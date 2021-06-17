# flatland documentation

## flatland code skeleton
### machine configuration

```javascript
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
    name: 'empty-machine-example',
    maxCount: 1,
    minSize: 20,
    maxSize: 30,
    lifetime: 1000,
    color1: [255, 0, 255],
    color1Opacity: 1,
    color2: [0, 0, 0],
    color2Opacity: 1,
    pendown: false
}
```
### machine/bot-code

```javascript
class Machine extends defaultMachine {
    setup() {
        // initialize your machine
        this.type = MachineType.RECT;
        this.pos.x = random(-100,100);
        this.pos.y = random(-100,100);
    }
    move() {
        // how does your machine move 
        this.pos.x+=random(-2,2);
        this.pos.y+=random(-2,2);
    }
}
```

### p5.js code
```javascript
let gui;
let flatland;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    flatland = new Flatland(); // connect to the flatland server
    initGui();
    initSocketIO(flatlandConfig.server);
}

function draw() {
    flatland.update(); // update + draw flatland
}

```


## drawing command

