//import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ["#FFBA0A","#00F59A","#3FBFE3","#FF6376","#BFABFF"];

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
class Particle {

  constructor(x, y, radius, color) {
    this.x = x
    this.y = y

    this.velocity = {
      x: (Math.random() - 0.5) * 1,
      y: (Math.random() - 0.5) * 1
    }

    this.radius = radius
    this.color = color
    this.mass = 1
    this.opacity = 0.2
    this.isCollided = false
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
  }

  update() {

      this.draw()

      for(let i = 0; i < particles.length; i++){

          if(this === particles[i]){
            continue; //get out of loop
          }

          if((distance(this.x,this.y,particles[i].x,particles[i].y) - this.radius * 2) < 0){
                //console.log('has collided')
                resolveCollision(this, particles[i]);

                this.isCollided ? false : true

                if(this.isCollided){
                  this.isCollided = false
                  this.opacity = 0.2
                }
                else{
                  this.isCollided = true
                  this.opacity = 0.6
                }

                particles[i].isCollided ? false : true

                if(particles[i].isCollided){
                  particles[i].isCollided = false
                  particles[i].opacity = 0.2
                }
                else{
                  particles[i].isCollided = true
                  particles[i].opacity = 0.6
                }
          }

      }

      if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width){
          this.velocity.x = -this.velocity.x;
      }
      if(this.y - this.radius <= 0 || this.y + this.radius >= canvas.height){
          this.velocity.y = -this.velocity.y;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;

  }

}

// Implementation
let particles

function init() {

    particles = []

    for (let i = 0; i < 100; i++) {

        const radius = 20;
        const color = randomColor(colors);
        let x = randomIntFromRange(radius, canvas.width-radius)
        let y = randomIntFromRange(radius, canvas.height-radius)

        if(i !== 0){

            for(let ii = 0; ii < particles.length; ii++){

                if((distance(x,y,particles[ii].x,particles[ii].y) - radius * 2) < 0){
                    x = randomIntFromRange(radius, canvas.width-radius)
                    y = randomIntFromRange(radius, canvas.height-radius)
                    ii = -1;
                }

            }

        }

        particles.push(new Particle(x,y,radius,color))

    }

}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(particle => {
    particle.update(particles)
  })
}

init()
animate()
