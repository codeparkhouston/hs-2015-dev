/**
 * # scene.js
 *
 * This file contains code all about the scene.
 */
'use strict';

var sceneElement = document.getElementById('scene');

function Scene(sceneElement){

  var sceneMethods = Object.create(null);
  var mazeBounds = [];
  var scene = {};
  var maze;

  if (typeof Maze === 'function'){
    sceneMethods.addMaze = addMaze;
    sceneMethods.clearMaze = clearMaze;
    sceneMethods.setMaze = setMaze;
  }

  sceneMethods.change = change;
  sceneMethods.reset = reset;

  setBody(sceneElement);
  listenToRobots();

  return sceneMethods;


  function setMaze(){
    if(maze){
      clearMaze();
    }
    addMaze();
  }


  function setBody(sceneElement){
    scene.element = sceneElement;
    scene.robots = sceneElement.getElementsByClassName('robot');
  }

  function toggleRecordingMode(){
    scene.element.parentNode.classList.toggle('record-mode');
  }

  function change(background, pattern){
    var backgroundCSS = background;
    pattern = pattern || false;

    if(isURL(background)){
      backgroundCSS = 'url(' + backgroundCSS + ')';
      scene.element.style.backgroundImage = backgroundCSS;
      scene.element.style.backgroundColor = null;
      scene.element.style.backgroundSize = 'cover';
      if(pattern){
        scene.element.style.backgroundSize = 'auto';
      }
    } else {
      scene.element.style.backgroundColor = backgroundCSS;
      scene.element.style.backgroundImage = null;
    }

    return 'Scene set to: ' + background;
  }

  function reset(){
    change('transparent');

    if(typeof maze === 'object'){
      clearMaze();
    }

    return 'Scene reset';
  }

  function addMaze(){
    var blockSize = 100;
    var changeEvent = new CustomEvent('mazed');
    var mazeSize, sceneSize;

    scene.element.dispatchEvent(changeEvent);
    scene.element.classList.add('maze');
    sceneSize = scene.element.getBoundingClientRect();

    mazeSize = {
      width: Math.floor(sceneSize.width/(blockSize * 1.5)) - 2,
      height: Math.floor(sceneSize.height/blockSize) - 2
    };

    maze = new Maze(mazeSize.width, mazeSize.height).generate().display();

    setTimeout(function(){
      mazeBounds = maze.getBounds();
    }, 1000);
  }

  function clearMaze(){
    maze.clear();
  }

  function refreshRobots(){
    _.each(scene.robots, refreshRobot);
  }

  function refreshRobot(robot){
    robot.src = robot.src;
  }

  function listenToRobots(){
    _.each(scene.robots, listenToRobot);
  }

  function listenToRobot(robot){
    robot.addEventListener('moving', checkRobot);
  }

  function trailRobots(){
    _.each(scene.robots, trailRobot);
  }

  function trailRobot(robot){
    var trailElement = robot.cloneNode(true);
    trailElement.className = 'trail';
    trailElement.removeAttribute('id');
    sceneElement.appendChild(trailElement);
  }

  function isBetween(compare, boundOne, boundTwo){
    return boundOne <= compare && compare <= boundTwo;
  }

  function hasOverlap(boxOne, boxTwo){
    var horizontal = [
      [boxOne.left, boxTwo.left, boxTwo.right],
      [boxOne.right, boxTwo.left, boxTwo.right],
      [boxTwo.left, boxOne.left, boxOne.right],
      [boxTwo.right, boxOne.left, boxOne.right]
    ];

    var vertical = [
      [boxOne.top, boxTwo.top, boxTwo.bottom],
      [boxOne.bottom, boxTwo.top, boxTwo.bottom],
      [boxTwo.top, boxOne.top, boxOne.bottom],
      [boxTwo.bottom, boxOne.top, boxOne.bottom]
    ];

    var hasHorizontalOverlap = _.find(horizontal, function(check){
      return isBetween.apply(isBetween, check);
    });
    var hasVerticalOverlap = _.find(vertical, function(check){
      return isBetween.apply(isBetween, check);
    });
    return !(_.isUndefined(hasHorizontalOverlap) || _.isUndefined(hasVerticalOverlap));
  }

  function checkRobot(moveEvent){
    if(mazeBounds.length> 0){
      trailRobots();

      var overlapsMaze = _.find(mazeBounds, function(mazeBound){
        return hasOverlap(moveEvent.detail.box, mazeBound);
      });
      var positions = {
        lion: moveEvent.detail.box,
        mazeBox: overlapsMaze
      };
      if(!_.isUndefined(overlapsMaze)){
        console.info('overlapsMaze');
        console.info(positions);
      }
    }
  }
}

function isURL(string){
  var isURLRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  return isURLRegex.test(string);
}