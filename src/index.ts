import { app } from './app'
import dat from 'dat.gui';

app.start()

window.addEventListener("load", () => {

  app.enableSound(false)
  app.setOutput('midi')
  
  function randomizeApp() : number {
    const seed = Math.floor(Math.random() * Math.pow(10,5))
    app.randomize(seed)
    return seed
  }

  class GuiParams {
    enableOutput = false;
    bpm = 30;
    output = 'midi';
    randomize = function() {
      this.seed = randomizeApp()
      this.bpm = app.getParams().bpm
    }
    seed = 0
  }

  const params = new GuiParams()
  const gui = new dat.GUI()
  var folder1 = gui.addFolder('Audio')

  folder1.add(params, 'enableOutput').listen().onChange( (val) => {
    app.enableSound(val)
  })
  folder1.add(params, 'output', { 
    'Midi (Channel 1)' : 'midi', 
    'Sampler (Piano)' : 'piano', 
    'Sampler (Guitar)' : 'guitar' 
  }).onChange( (val) => {
    app.setOutput(val)
    params.enableOutput = false
  })

  var folder2 = gui.addFolder('Settings')
  folder2.add(params, 'randomize')
  folder2.add(params, 'bpm', 10, 120, 1).listen().onFinishChange( (val) => {
    app.setBpm(val)
  })

  folder1.open()
  folder2.open()

  randomizeApp()

})