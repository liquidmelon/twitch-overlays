//from source : throws errors
//import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ["#F0F0FF","#FAB4FF","#FACDCD","#FEEE85","#BEFAE1","#00C8AF","#D2D2E6","#BFABFF","#FC6675","#FFCA5F","#57BEE6","#0014A5","#8205B4","#FA1ED2","#FF6905","#FAFA19","#BEFF00","#00FAFA","#41145F","#BE0078","#FA2828","#00FA05","#69FFC3","#1E69FF",]

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Circle {

  constructor(x, y, radius, color) {
    this.x = x
    this.y = y

    this.velocity = {
      x: 0,
      y: 0
    }

    this.radius = radius
    this.color = color
    this.mass = 0


  }

  draw() {

    c.globalCompositeOperation = "destination-over";


    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)

    c.fillStyle = this.color
    c.fill()

    //c.strokeStyle = "black"
    //c.lineWidth = 16
    //c.stroke()
    c.closePath()


    c.globalCompositeOperation = "source-over";

  }

  update() {

    this.draw()

    for(let i = 0; i < particles.length; i++){

      if((distance(this.x,this.y,particles[i].x,particles[i].y) - this.radius - particles[i].radius) < 0){
        //console.log('has collided')
        resolveCollisionBox(this, particles[i]);
      }

    }

  }

}

// Objects
class Particle {

  constructor(x, y, radius, color) {

    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.mass = 2; //Math.floor((Math.random() * 50) + 1)
    this.opacity = 0.0
    this.displayicon = false

    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5
    }

  }

  draw() {
    c.beginPath()

    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)

    c.save()
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color
    c.fill()
    c.restore()

    c.strokeStyle = this.color
    c.lineWidth = 4
    c.stroke()

    c.closePath()

    //draw only if transparent
    if(!this.displayicon){
        //redraw icon
        c.drawImage(twitchicon, this.x-12, this.y-12, 24, 28);

        //change icon color
        c.globalCompositeOperation = "source-atop";
        c.fillStyle = this.color;
        c.fillRect(this.x-12, this.y-12, 24, 28);

        // reset comp. mode
        c.globalCompositeOperation = "source-over";
    }


  }

  update() {

      this.draw()

      //check this particle for overlap against all particles, but not against itself...
      for(let i = 0; i < particles.length; i++){

           //...so if this particle == particles[i], get out of loop
          if(this === particles[i]){
            continue;
          }
          //determine if overlap exists
          if((distance(this.x,this.y,particles[i].x,particles[i].y) - this.radius * 2) < 0){

              //console.log('has collided')

              resolveCollision(this, particles[i]);

              //

              if(this.displayicon){
                this.displayicon = false
                this.opacity = 0.0
              }
              else{
                this.displayicon = true
                this.opacity = 1.0
              }

              //

              if(particles[i].displayicon){
                particles[i].displayicon = false
                particles[i].opacity = 0.0
              }
              else{
                particles[i].displayicon = true
                particles[i].opacity = 1.0
              }

              //

              if(this.displayicon){
                this.color = randomColorNotDuplicate(colors,this.color)
              }
              if(particles[i].displayicon){
                particles[i].color = randomColorNotDuplicate(colors,this.color)
              }

          }

      }

      //reverse the velocity when hitting the edges
      if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width){
          this.velocity.x = -this.velocity.x;
      }
      if(this.y - this.radius <= 0 || this.y + this.radius >= canvas.height){
          this.velocity.y = -this.velocity.y;
      }

      //move the particle
      this.x += this.velocity.x;
      this.y += this.velocity.y;

  }

}

// Implementation  /////////////////////////////////////////////////////////
let particles
let twitchicon
let myPattern

function init() {

  particles = []

  //make many particles
  for (let i = 0; i < 20; i++) {
    //particle defaults
    const radius = 20;
    const color = randomColor(colors);
    let x = randomIntFromRange(radius, canvas.width-radius)
    let y = randomIntFromRange(radius, canvas.height-radius)

    //check all particles for any overlap, respawn if there is...
    if(i !== 0){  //...but only for (x,y) after the first one [i=0]

        for(let ii = 0; ii < particles.length; ii++){
            //determine if overlap exists
            if((distance(x,y,particles[ii].x,particles[ii].y) - radius * 2) < 0){
                //get new x,y
                x = randomIntFromRange(radius, canvas.width-radius)
                y = randomIntFromRange(radius, canvas.height-radius)
                ii = -1; //reset the loop, intentionally -1
            }

        }

    }

    //make one particle and push into array
    particles.push(new Particle(x,y,radius,color))
  }

  //create icon from image
  twitchicon = new Image();
  twitchicon.onload = function() {
     c.drawImage(twitchicon, 0, 0, 24, 28);
  };
  twitchicon.src = masterimage; //'TwitchGlitch.png';

  //create large circle
  myCircle = new Circle(640,360,150,'black');

  //create pattern
  myPattern = new Image();
  myPattern.onload = function() {
     pattern = c.createPattern(myPattern, 'repeat');
  };
  myPattern.src = 'pattern-1.png';

}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  //c.fillStyle = 'black'
  //c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)

  //note, "object" has its own fillStyle when it's drawn - aq
  particles.forEach(object => {
    object.update()
  })

  //draw large circle
  myCircle.update()

  //draw large inner circle
  c.beginPath()
  c.arc(640,360, 142, 0, Math.PI * 2, false)

  c.fillStyle = '#9146FF'
  c.fill()

  c.closePath()

  //draw face color
  c.fillStyle = 'white'
  c.beginPath();
  c.moveTo(626, 242);
  c.lineTo(626, 284);
  c.lineTo(645, 284);
  c.lineTo(660, 266);
  c.lineTo(660, 241);
  c.fill();

  //draw icon
  c.drawImage(twitchicon, 616, 240, 48, 56);

  //draw words
  c.font = 'bold 24px Trebuchet MS';
  c.textAlign = 'right';
  c.fillText('INTERMISSION', 664, 367);
  c.fillText('5:00', 664, 389);

  //draw patttern
  c.globalCompositeOperation = "destination-over";
  c.rect(0, 0, 1280, 720);
  c.fillStyle = pattern;
  c.fill();
  c.globalCompositeOperation = "source-over";

}

init()
animate()
