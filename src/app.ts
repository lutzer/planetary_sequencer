import _ from 'lodash';
import { Stage } from "./engine/stage"
import { InstrumentPlanet, NoteTriggerCallbackHandler } from './components/instrumentPlanets'
import { NoteTrigger } from './sound/note'
import { Orbit } from './components/orbit';
import { NotePlanet, NoteContextMenuHandler } from './components/notePlanets';
import { InteractiveCanvasElement } from './engine/interactiveCanvasElement';
import { CanvasMouseEvent } from './engine/canvasMouse';
import { NoteMenuOverlay } from './menu/noteMenuOverlay';
import globals from './globals'
import { MidiOutput } from './sound/midiOutput';
import { SynthStorage } from './storage/storage';

const settings = {
  width: 512,
  height: 512,
  zoom: 0.1,
  fps : 60,
  saveInterval: 5000
}

const app = ( function() {

  var storage = new SynthStorage()

  var audioOutput = new MidiOutput({ channel: 1})

  const stage = new Stage({ width: settings.width, height: settings.height })
  const root = new InteractiveCanvasElement({ 
    x: stage.width/2, 
    y: stage.height/2, 
    scale: Math.min(stage.width, stage.height)/2,
    rotation : -Math.PI/2,
    handleEventTypes : [] //ignore all events
  })

  stage.onMouseEvent((event : CanvasMouseEvent) => {
    root.handleMouseEvent(event)
  })

  // handler for sound triggers
  const onNoteTrigger : NoteTriggerCallbackHandler = (sound: NoteTrigger, atTime: number) => {
    // console.info(['playnote',sound.getNoteString(),sound.getOctave()])
    if (audioOutput.isEnabled()) {
      audioOutput.scheduleNote(sound.getNoteString(), sound.getGate() * 1000, atTime)
    }
  }

  // creates menu overlay on note click
  globals.onNoteContextMenu = function(planet: NotePlanet, position : [number, number]) {
    var menu = new NoteMenuOverlay(planet, position)
    stage.container.insertBefore(menu.domElement, stage.canvas)
  }

  // create root node
  var instrument = new InstrumentPlanet({bpm: 30, scale: settings.zoom, noteTriggerCallback : onNoteTrigger})

  // add instrument to canvas
  root.addChild(instrument)

  setInterval( () => {
    storage.save(instrument)
  }, settings.saveInterval)
  
  function setup(defaultValues = false) {
    instrument.clear()

    // load data
    var data = storage.load(defaultValues)

    // setup planets
    instrument.bpm = data.bpm
    data.orbits.forEach( (orbitData) => {
      const orbit = instrument.addChild(new Orbit({ speed: orbitData.speed, steps: orbitData.steps, snap: orbitData.snap}))
      orbitData.notes.forEach( (noteData) => {
        orbit.addChild(new NotePlanet({ octave: noteData.octave, note: noteData.note, phase: noteData.phase, gate: noteData.gate}))
      });
    })
  } 
  
  function loop(time : number = 0.0, updated : number = 0.0) {

    time = Math.round(audioOutput.time)

    if ((time-updated) > 1000/settings.fps) {
      var context = stage.renderer
      context.resetTransform()

      //clear canvas
      context.globalAlpha = 1.0
      context.fillStyle = 'white'
      context.fillRect(0,0, stage.width, stage.height)

      // update all nodes
      instrument.update(time)
      
      //draw everything
      root.render(stage)

      updated = time
    }

    requestAnimationFrame(() => loop(time, updated));
  }

  return {
    start : () => {
      setup()
      loop()
    },
    save : () => {
      storage.save(instrument)
    },
    reset : () => {
      setup(true)
    },
    enableSound(enable : boolean) {
      audioOutput.enable(enable)
    },
    setBpm(bpm : number) {
      instrument.bpm = bpm
    },
    getBpm() : number {
      return instrument.bpm
    }
  }
})()

export { app }
