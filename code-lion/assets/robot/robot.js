/**
 * # robot.js
 *
 * This file contains code all about the robot.
 */
'use strict';

function makeNewRobot(imageURL){
  var robotEl = makeNewRobotBody(imageURL);
  return new Robot(robotEl);
}

function makeNewRobotBody(imageURL){
  var robotBody = document.createElement('div');
  var robotImage = document.createElement('img');
  robotBody.classList.add('robot');
  robotImage.src = imageURL;
  robotBody.appendChild(robotImage);

  sceneElement.appendChild(robotBody);

  return robotBody;
}

function Robot(robotElement) {
  /**
   * `robotMethods` will hold onto what the robot can do.
   */
  var robotMethods = Object.create(null);

  robotMethods.getElementPosition = getElementPosition;
  robotMethods.getSize = getSize;
  robotMethods.getElement = getElement;
  robotMethods.getImage = getImage;
  robotMethods.getOrientation = getOrientation;
  robotMethods.getPosition = getPosition;

  robotMethods.moveTo = moveTo;
  robotMethods.move = move;
  robotMethods.moveRandom = moveRandom;
  robotMethods.change = change;
  robotMethods.reset = reset;
  robotMethods.name = name;
  robotMethods.flip = flip;
  robotMethods.leave = leave;
  robotMethods.sizeTo = sizeTo;
  robotMethods.comeBack = comeBack;

  /**
   * We are going to use `robot` to hold onto some private information about our robot.
   */
  var robot = {};
  var scene = {};

  /**
   * `setBody` gives the robot a body that is the HTML element passed in as `robotElement`
   */
  setBody(robotElement);

  setScene(robotElement.parentElement);

  /**
   * Give `robotMethods` out for the coder to use elsewhere, as in the `console`.
   */
  return robotMethods;


  /**
   * # Functions
   */


  /**
   * ## setBody
   * 
   * Gives the robot a body.
   * 
   * @param {DOMElement} robotElement The HTML Element that the robot's capabilities should be attached to.
   */
  function setBody(robotElement){

    if(isMissingParameters(arguments, 'setBody')){
      return;
    }

    robot.element = robotElement;
    robot.img = robot.element.getElementsByTagName('img')[0]
    robot.img.onload = setSizeAndPosition;
    // Force an image reload to make `setSizeAndPosition` run.
    robot.img.src = robot.img.src;
    robot.name = '';
    robot.setWidth = 200;
  }

  function setScene(sceneElement){
    scene.element = sceneElement;
    setSceneSize();
    window.onresize = _.throttle(setSceneSize, 100);

    scene.element.addEventListener('mazed', setIntoMaze);
  }

  function setIntoMaze(){
    sizeTo(50);
  }

  function sizeTo(width){
    if(typeof width === 'number'){
      robot.setWidth = width;
    } else {
      robot.setWidth = robot.element.getBoundingClientRect().width;
    }
    robot.element.style.width = robot.setWidth + 'px';
    setTimeout(setSizeAndPosition, 150);

    return ' sized changed to: ' + robot.setWidth + 'px';
  }

  function setSizeAndPosition(){
    robot.size = getSize();
    if(robot.position){
      robot.position.unset();
    }
    robot.position = new Position(robotMethods);

    if(!robot.defaults){    
      setDefaults();
    }
  }

  /**
   * ## setDefaults
   * 
   * Remembers the initial information about the robot.
   * We can use `robot.defaults` later to be able to reset the robot to it's original state.
   */
  function setDefaults(){
    var orientation = getOrientation();
    robot.defaults = {}
    robot.defaults.name = robot.name;
    robot.defaults.setWidth = robot.setWidth;
    robot.defaults.src = robot.img.getAttribute('src');
    robot.defaults.position = getElementPosition();

    robot.defaults.position.direction = orientation.direction;
    robot.defaults.position.angle = orientation.angle;
  }

  function setSceneSize(){
    scene.size = scene.element.getBoundingClientRect();
    scene.element.dataset.width = Math.round(scene.size.width);
    scene.element.dataset.height = Math.round(scene.size.height);
  }

  /**
   * ## getElementPosition
   * 
   * Tells us where the robot is.
   * @return {Object} with an x and y for where the robot is.
   */
  function getElementPosition(){
    var boundingRectangle = robot.element.getBoundingClientRect();
    return {
      x: boundingRectangle.left + boundingRectangle.width/2,
      y: boundingRectangle.top + boundingRectangle.height/2
    };
  }

  function getOrientation(){
    return {
      direction: robot.position.direction,
      angle: robot.position.angle
    };
  }

  function getSize(){
    var boundingRectangle = robot.element.getBoundingClientRect();
    var size = {
      width: boundingRectangle.width,
      height: boundingRectangle.height
    };

    return size;
  }

  function moveTo(x, y){

    if(isMissingParameters(arguments, 'moveTo')){
      return;
    }

    robot.position.coordinates = {x: x, y: y};
    return robot.name + ' moving to: ' + x + 'px, ' + y + 'px';
  }

  function move(direction, distance){

    var movers = {
      left: moveLeft,
      right: moveRight,
      down: moveDown,
      up: moveUp
    };

    if(isMissingParameters(arguments, 'move')){
      return;
    }

    return movers[direction](distance);

    function moveLeft(distance) {
      var currentPosition = getElementPosition();
      var newX = currentPosition.x + distance;

      return moveTo(newX, currentPosition.y);
    }

    function moveDown(distance) {
      var currentPosition = getElementPosition();
      var newY = currentPosition.y + distance;

      return moveTo(currentPosition.x, newY);
    }

    function moveRight(distance) {
      return moveLeft( - 1 * distance);
    }

    function moveUp(distance) {
      return moveDown( - 1 * distance);
    }
  }

  function moveRandom(){
    // Use the robot size to calculate where the center of the robot is
    // relative to the edge.
    var robotSize = robot.size;
    var xRobotCenter = robotSize.width/2;
    var yRobotCenter = robotSize.height/2;

    var maxRandomX = scene.size.width - robotSize.width;
    var maxRandomY = scene.size.height - robotSize.height;

    // ```Math.random()``` returns a random number in between 0 and 1.
    // Multiplying it by the scene dimension scales the random number.
    // In this case, the random number will be between 0 and scene width
    // and height minus the robot width and height -- max random x and
    // max random y.
    // 
    // Adding the robot center helps offsets the position so that
    // it's the position for the center of the robot.
    var randomX = parseFloat((Math.random() * maxRandomX + xRobotCenter).toFixed(1));
    var randomY = parseFloat((Math.random() * maxRandomY + yRobotCenter).toFixed(1));

    // Use the previously defined ```moveTo``` to do the moving.
    return moveTo(randomX, randomY);
  }

  function change(imageURL) {
    if(isMissingParameters(arguments, 'change')){
      return;
    }

    robot.img.src = imageURL;

    return 'Robot image set to: ' + imageURL;
  }

  function reset() {

    var onload = robot.img.onload;

    robot.img.onload = function(){
      onload();
      moveTo(robot.defaults.position.x, robot.defaults.position.y);
      robot.img.onload = onload;
    };

    sizeTo(robot.defaults.setWidth);
    change(robot.defaults.src);
    name(robot.defaults.name);

    return 'Robot reset to original position and image';
  }

  function leave() {
    sizeTo(0);
    return 'Goodbye ' + robot.name + '!';
  }

  function comeBack() {
    sizeTo(robot.defaults.setWidth);
    return 'Hello ' + robot.name + '!';
  }

  function name(robotName) {
    if(isMissingParameters(arguments, 'name')){
      return;
    }

    robot.name = robotName;
    robot.element.dataset.name = robotName;

    return 'Robot got named: ' + robotName;
  }

  function flip(){
    robot.element.classList.toggle('flip');

    return 'Robot flipped!';
  }

  function getElement(){
    return robot.element;
  }

  function getImage(){
    return robot.img;
  }

  function getPosition(){
    return robot.position;
  }

}
