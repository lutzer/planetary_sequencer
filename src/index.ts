import { app } from './app'

//app.start()
app.startTestScene()  

window.addEventListener('load', () => {
  
  var enabled = false
  var soundbutton = <HTMLInputElement>document.getElementById('button-sound')
  soundbutton.addEventListener('click', () => {
    app.enableSound(enabled = !enabled)
    soundbutton.className = enabled ? '' : 'muted' 
  })

  var randomizeButton = document.getElementById('button-randomize')
  randomizeButton.addEventListener('click', () => {
    app.restart()
  })
})