# flatland documentation



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
### machine/bot-code-skeleton

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

### p5.js code-skeleton
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

### drawing/bot shape type

#### circle
```javascript
this.type = MachineType.CIRCLE;
// or
this.setType(MachineType.CIRCLE);
```
#### rect
```javascript
this.type = MachineType.RECT;
// or
this.setType(MachineType.RECT);
```
#### point
```javascript
this.type = MachineType.POINT;
// or
this.setType(MachineType.POINT);
```
#### line
```javascript
this.type = MachineType.LINE;
// or
this.setType(MachineType.LINE);
```

### drawing/bot rotation
```javascript
this.rotation =  PI/4; // 45 degree
// or
this.setRotation( PI/4 );
```

### drawing/bot position
**coordinate systen 0,0 is in the screen center**
```javascript
this.pos.x = 100;
this.pos.y = -100; 
// or
this.setPosition( 100, -100 );
```

