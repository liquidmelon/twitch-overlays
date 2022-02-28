function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

//from source : throws errors
//module.exports = { randomIntFromRange, randomColor, distance }

//////////////////////////////////////////////

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

//////////////////////////////////////////////

//returns a color other than itself
function randomColorNotDuplicate(colors, c1) {
  let c2 = colors[Math.floor(Math.random() * colors.length)]
  while(c2 == c1){
    c2 = colors[Math.floor(Math.random() * colors.length)]
  }
  return c2
}

function resolveCollisionBox(static, otherParticle) {
   const xVelocityDiff = static.velocity.x - otherParticle.velocity.x;
   const yVelocityDiff = static.velocity.y - otherParticle.velocity.y;

   const xDist = otherParticle.x - static.x;
   const yDist = otherParticle.y - static.y;

   // Prevent accidental overlap of particles
   if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

       // Grab angle between the two colliding particles
       const angle = -Math.atan2(otherParticle.y - static.y, otherParticle.x - static.x);

       // Store mass in var for better readability in collision equation
       const m1 = static.mass;
       const m2 = otherParticle.mass;

       // Velocity before equation
       const u1 = rotate(static.velocity, angle);
       const u2 = rotate(otherParticle.velocity, angle);

       // Velocity after 1d collision equation
       const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
       const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

       // Final velocity after rotating axis back to original location
       const vFinal1 = rotate(v1, -angle);
       const vFinal2 = rotate(v2, -angle);

       // Swap particle velocities for realistic bounce effect
       //static.velocity.x = vFinal1.x;
       //static.velocity.y = vFinal1.y;

       otherParticle.velocity.x = vFinal2.x;
       otherParticle.velocity.y = vFinal2.y;
   }
}

/////////////////////////////////////////////

let masterimage = 'data:image/png;base64,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'

let patterndata = 'data:image/png;base64,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'
