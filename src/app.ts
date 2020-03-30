import _ from 'lodash';
import { Stage } from "./engine/stage"
import { CanvasElement } from './engine/canvasElement'
import { InstrumentPlanet, NotePlanet } from './components/planets';

const App = function() {

  const stage = new Stage({width: 512, height: 512})
  const root = new CanvasElement({ x: stage.width/2, y: stage.height/2, scale: Math.min(stage.width, stage.height)/2})

  // setup scene
  var instrument = new InstrumentPlanet({x: 0, y: 0})
  instrument.addChild(new NotePlanet({note: 'C', octave: 2, distance: 0.5, phase : 0.0}))
  instrument.addChild(new NotePlanet({note: 'E#', octave: 2, distance: 0.7}))

  root.addChild(instrument)
  
  function loop(time : number = 0.0, dt : number = 0.0) {
      var context = stage.renderer
      context.resetTransform()
      context.lineWidth = 1/stage.width

      context.globalAlpha = 1.0
      context.fillStyle = 'white'
      context.fillRect(0,0, stage.width, stage.height)

      instrument.update(dt)

      // draw lines between planets
      instrument.drawConnections(stage, 0.2)
      
      //draw everything
      root.draw(stage)

      requestAnimationFrame((newTime) => loop(newTime, (newTime - time) / 1000 ));
  }

  return {
    start : () => {
      loop()
    }
  }
}

export { App }
