# All code to do with the robot is in this folder.

A robot's body is a div with an image inside. It looks like this:
```html
    <!-- index.html -->
    <div id="robot" class="robot flip">
      <!-- Image from http://www.clipartlord.com/wp-content/uploads/2014/02/lion8.png -->
      <img src="./assets/robot/lion.png">
    </div>
```

## Insantiating a robot

If the robot body already exists, create a robot with 
```javascript
    // main.js
    var robotElement = document.getElementById('robot');
    var robot = new Robot(robotElement);
```
----

The makeNewRobot(id, imageURL) function is provided for creating new robots on the fly.
