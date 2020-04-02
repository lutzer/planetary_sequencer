import { app } from './app'

app.start()
// app.startTestScene()  

window.addEventListener('load', () => {

  var bpmInput = <HTMLInputElement>document.getElementById('input-bpm')
  
  var enabled = false
  var soundbutton = <HTMLInputElement>document.getElementById('button-sound')
  soundbutton.addEventListener('click', () => {
    app.enableSound(enabled = !enabled)
    soundbutton.className = enabled ? '' : 'muted' 
  })

  var randomizeButton = <HTMLInputElement>document.getElementById('button-randomize')
  randomizeButton.addEventListener('click', () => {
    app.restart()
    bpmInput.value = app.getParams().bpm
  })

  bpmInput.value = app.getParams().bpm
  bpmInput.addEventListener('change', () => {
    app.setBpm(Number(bpmInput.value))
  })

  var selectOutput = <HTMLSelectElement>document.getElementById('select-output')
  selectOutput.addEventListener('change', () => {
    app.setOutput(selectOutput.value)
    app.enableSound(false)
    enabled = false
    soundbutton.className = 'muted' 
  })

})