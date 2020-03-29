import _ from 'lodash';
import { Stage } from "./stage"

const App = (function() {

  var stage : Stage

  function setup() {
    stage = new Stage({width: 512, height: 512})
  }
  
  function loop(time : number = 0.0, dt : number = 0.0) {
      var context = stage.context

      context.fillStyle = 'gray'
      context.fillRect(0,0, stage.width, stage.height)

      requestAnimationFrame((newTime) => loop(newTime, newTime - time));
  }

  return {
    start : () => {
      setup()
      loop()
    }
  }
})()

export { App }
