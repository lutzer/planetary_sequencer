import { app } from './app'
import dat, { GUIController } from 'dat.gui';

app.start()

window.addEventListener("load", () => {

  app.enableSound(false)
  app.setOutput('midi')
  
  // function randomizeApp() : number {
  //   const seed = 
  //   // app.randomize(seed)
  //   return seed
  // }

  var seedControl : GUIController = null

  class GuiParams {
    enableOutput = false;
    bpm = 30;
    output = 'midi';
    randomize = function() {
      this.seed = Math.floor(Math.random() * Math.pow(10,5))
      this.bpm = app.getParams().bpm
      seedControl.updateDisplay()
      app.randomize(this.seed)
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

  var folder2 = gui.addFolder('Parameters')
  folder2.add(params, 'randomize')
  seedControl = folder2.add(params, 'seed').onFinishChange( (val) => {
    app.randomize(val)
  })
  folder2.add(params, 'bpm', 10, 120, 1).listen().onFinishChange( (val) => {
    app.setBpm(val)
  })

  folder1.open()
  folder2.open()

  params.randomize()

})