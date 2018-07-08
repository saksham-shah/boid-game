// Flocking algorithm without seperation as that is a 'seperate' function
Person.prototype.flock = function(people, weight) {
  var alignW = 1 * weight;
  var cohesionW = 1 * weight;

  var align = this.align(people, 50);
  var cohesion = this.cohesion(people, 50);

  align.mult(alignW);
  cohesion.mult(cohesionW);

  this.applyForce(align);
  this.applyForce(cohesion);
}

// Try to match everyone else's velocity (magnitude AND direction)
Person.prototype.align = function(people, alignDist) {
  var totalVel = createVector(0, 0);
  var alignCount = 0;
  for (var i = 0; i < people.length; i++) {
    var d = p5.Vector.dist(this.pos, people[i].pos);

    // Only influenced by nearby people
    if ((d > 0) && (d < alignDist)) {
      totalVel.add(people[i].vel);
      alignCount++;
    }
  }

  // Division by zero nightmare
  if (alignCount > 0) {
    totalVel.div(alignCount);
    return (this.getForce(totalVel));
  } else {
    return createVector(0, 0);
  }

  // Unused but keeping it in case I need to change it back, as it's a recent change
  if (totalVel.mag() > 0) {
    totalVel = this.getForce(totalVel);
  }

  return totalVel;
}

// Try to stay in the middle of the group
Person.prototype.cohesion = function(people, cohDist) {
  var totalPos = createVector(0, 0);
  var cohCount = 0;
  for (var i = 0; i < people.length; i++) {
    var d = p5.Vector.dist(this.pos, people[i].pos);

    // Only influenced by nearby people
    if ((d > 0) && (d < cohDist)) {
      totalPos.add(people[i].pos);
      cohCount++;
    }
  }

  // Again division by zero
  if (cohCount > 0) {
    totalPos.div(cohCount);
    return this.seek(totalPos);
  } else {
    return createVector(0, 0);
  }
}
