import { app } from './app'
import dat, { GUIController } from 'dat.gui';

window.addEventListener("load", () => {
  app.start()
  app.enableSound(true)
})

class GuiParams {
  enableOutput = true;
  bpm = app.getBpm()
  output = 'midi';
  save = function() {
    app.save()
  }
  reset = function() {
    app.reset()
    app.getBpm()
  }
  seed = 0
}

const params = new GuiParams()
const gui = new dat.GUI()
gui.close()

gui.add(params, 'enableOutput').listen().onChange( (val) => {
  app.enableSound(val)
})
gui.add(params, 'bpm', 10, 120, 1).listen().onFinishChange( (val) => {
  app.setBpm(val)
})
//gui.add(params, 'save')
gui.add(params, 'reset')