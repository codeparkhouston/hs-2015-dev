/**
 * # robot.js
 *
 * This file contains code all about the robot.
 */

var robotEl = document.getElementById('robot');
var cecil = new Robot(robotEl);

function Robot(robotEl) {
  /**
   * `robotMethods` will hold onto what the robot can do.
   */
  var robotMethods = {
    getPosition: getPosition,
    getSize: getSize,
    moveTo: moveTo,
    move: move,
    moveRandom: moveRandom,
    change: change,
    reset: reset,
    name: name,
    flip: flip,
    getElement: getElement
  };

  /**
   * We are going to use `robot` to hold onto some private information about our robot.
   */
  var robot = {};

  /**
   * `setBody` gives the robot a body that is the HTML element passed in as `robotEl`
   */
  setBody(robotEl);

  /**
   * Give `robotMethods` out to the coder use elsewhere, as in the `console`.
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
    robot.element = robotElement;
    robot.img = robot.element.getElementsByTagName('img')[0]
    robot.img.onload = setSizeAndPosition;
    // Force an image reload to make `setSizeAndPosition` run.
    robot.img.src = robot.img.src;
    robot.name = '';
  }


  function setSizeAndPosition(){
    robot.size = getSize();
    robot.position = new Position(robot);

    setDefaults()
  }

  /**
   * ## setDefaults
   * 
   * Remembers the initial information about the robot.
   * We can use `robot.defaults` later to be able to reset the robot to it's original state.
   */
  function setDefaults(){
    robot.size = getSize();
    robot.position = new Position(robot);

    robot.defaults = {}
    robot.defaults.src = robot.img.src;
    robot.defaults.position = getPosition();
  }

  /**
   * ## getPosition
   * 
   * Tells us where the robot is.
   * @return {Object} with an x and y for where the robot is.
   */
  function getPosition(){
    return robot.position.get();
  }

  function getSize(){
    var boundingRectangle = robot.element.getBoundingClientRect();
    var size = {
      width: boundingRectangle.right - boundingRectangle.left,
      height: boundingRectangle.bottom - boundingRectangle.top
    };

    return size;
  }

  function moveTo(x, y){
    robot.position.x = x;
    robot.position.y = y;

    return robot.name + ' moved to ' + x + ', ' + y;
  }

  function move(direction, distance){

    var movers = {
      left: moveLeft,
      right: moveRight,
      down: moveDown,
      up: moveUp
    };

    return movers[direction](distance);

    function moveLeft(distance) {
      var currentPosition = getPosition();
      var newX = currentPosition.x + distance;

      return moveTo(newX, currentPosition.y);
    }

    function moveDown(distance) {
      var currentPosition = getPosition();
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
    var robotSize = robot.size;
    var xBuffer = robotSize.width/2;
    var yBuffer = robotSize.height/2;

    var randomXMax = window.innerWidth - 2 * xBuffer;
    var randomYMax = window.innerHeight - 2 * yBuffer;

    var randomX = Math.random() * randomXMax + xBuffer;
    var randomY = Math.random() * randomYMax + yBuffer;

    return moveTo(randomX, randomY);
  }

  function change(imageURL) {
    robot.img.src = imageURL;
  }

  function reset() {
    robot.position.angle = robot.defaults.position.angle;
    robot.position.scale = robot.defaults.position.scale;
    robot.position.x = robot.defaults.position.x;
    robot.position.y = robot.defaults.position.y;

    change(robot.defaults.src);
  }

  function name(robotName) {
    robot.name = robotName;
    robot.element.dataset.name = robotName;
  }

  function flip(){
    robot.element.classList.toggle('flip');
  }

  function getElement(){
    return robot.element;
  }
}

