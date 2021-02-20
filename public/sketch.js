let circleObject = [];
let socket;

function setup() {
  createCanvas(800, 600);
  background(255);
  smooth(8);
  noStroke();
  socket = io.connect('http://localhost:5000');
  socket.on('eventFromServer', newDrawing);
}

function newDrawing(data){
  console.log(data);
  circleObject.push(new Circle(data.xData, data.yData, data.speedXData, data.speedYData,
    data.radiusData, data.rData, data.gData, data.bData, data.lifeData, random(100,1000)));
}

function mousePressed(){
  let speedX = random(10.) - 5.;
  let speedY = random(10.) - 5.;
  let radiusCircle= parseInt(random(100+10));
  let r = parseInt(random(255));
  let g = parseInt(random(255));
  let b = parseInt(random(255));
  let life = parseInt(random(100,1000));

  circleObject.push(new Circle(mouseX, mouseY, speedX, speedY, radiusCircle, r, g, b, life));

  let data = {
    xData: mouseX,
    yData: mouseY,
    speedXData: speedX,
    speedYData: speedY,
    radiusData: radiusCircle,
    rData: r,
    gData: g,
    bData: b,
    lifeData: life
  }

  socket.emit('eventFromClient', data);
}

function draw() {
  background(255);
  for (let i=0; i<circleObject.length; i++) {
    circleObject[i].drawCircle();
    circleObject[i].motion();
    circleObject[i].destroy();
    //console.log(circleObject.length);
    if (circleObject[i].destroy() <= 0) {
      circleObject.splice(i,1);
    }
  }
}

class Circle{
  constructor (_x, _y, _speedX, _speedY, _radius, _r, _g, _b, _timer){
    this.x = _x;
    this.y = _y;
    this.xMove = _speedX;
    this.yMove = _speedY;
    this.radius= _radius;

    this.rd = _r;
    this.grn = _g;
    this.bl = _b;
    this.a = 255;

    this.timer = _timer;
    this.initTime = _timer;
  }

  drawCircle(){
    let fillcol = color(this.rd, this.grn, this.bl, this.a)
    fill(fillcol);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  }

  motion(){
    this.x += this.xMove;
    this.y += this.yMove;
    if (this.x > (width+this.radius)) this.x = 0 - this.radius;
    if (this.x < (0-this.radius)) this.x = width+this.radius;
    if (this.y > (height+this.radius)) this.y = 0 - this.radius;
    if (this.y < (0-this.radius)) this.y = height+this.radius;
  }

  destroy(){
    let getTimer;
    this.timer--;
    getTimer = this.timer;
    this.a = map(this.timer, 0, this.initTime, 0, 255);
    return getTimer;
  }
}