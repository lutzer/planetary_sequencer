import _ from "lodash"
import { CanvasHtml, getStyleString } from "./canvasHtml"
import { NotePlanet } from "../components/notePlanets"
import { Note } from './../sound/note'

class NoteMenuOverlay extends CanvasHtml {

  style : any = {
    'position' : 'absolute',
    'top' : '0px',
    'right' : '0px',
    'left' : '0px',
    'bottom' : '0px',
    'opacity' : 1.0,
  }

  containerStyle : any = {
    'display' : 'inline-block',
    'background': '#ffffff',
    'padding': '10px',
    'border-radius' : '5px',
    'width' : 'auto',
    'color' : '#000000',
    'border' : '1px solid #cccccc'
  }

  constructor(planet : NotePlanet, position : [number, number]) {
    super('note-menu')
    this.htmlElement.setAttribute('style', getStyleString(this.style))

    // elements
    const selectOctave = <HTMLSelectElement>this.getChildElement('select-octave')
    const selectNote = <HTMLSelectElement>this.getChildElement('select-note')

    selectOctave.value = String(planet.note.getOctave())
    selectNote.value = String(planet.note.getNote())

    // add listeners
    this.addListener(null, 'click', () => this.close())
    this.addListener('button-close', 'click', () => this.close())
    this.addListener('button-delete', 'click', () => { 
      planet.delete()
      this.close()
    })
    this.addListener('note-menu-container', 'click', (event : MouseEvent) => {
      event.stopPropagation()
    })
    this.addListener('select-octave', 'change', (event : any) => {
      planet.setNoteParam('octave', Number(selectOctave.value))
    })
    this.addListener('select-note', 'change', (event : any) => {
      planet.setNoteParam('note', Number(selectNote.value))
    })

    // apply container box style
    Object.assign(this.containerStyle, {
      'margin-left' : position[0]+10 + 'px',
      'margin-top' : position[1] + 'px',
    })
    this.getChildElement('note-menu-container').setAttribute('style', getStyleString(this.containerStyle) )
  }

  close() {
    this.htmlElement.parentElement.removeChild(this.htmlElement)
  }

  render() : string {
    
    return /*html*/`
      <div class="note-menu-container">
        <div>
          <label style="width: 60px; display: inline-block;" for="select-note">Note</label>
          <select style="width: 50px;" id="select-note" class="select-note">
            <option value="0">${Note.fromInt(0)}</option>
            <option value="1">${Note.fromInt(1)}</option>
            <option value="2">${Note.fromInt(2)}</option>
            <option value="3">${Note.fromInt(3)}</option>
            <option value="4">${Note.fromInt(4)}</option>
            <option value="5">${Note.fromInt(5)}</option>
            <option value="6">${Note.fromInt(6)}</option>
            <option value="7">${Note.fromInt(7)}</option>
            <option value="8">${Note.fromInt(8)}</option>
            <option value="9">${Note.fromInt(9)}</option>
            <option value="10">${Note.fromInt(10)}</option>
            <option value="11">${Note.fromInt(11)}</option>
          </select>
        <div>
        <div>
          <label style="width: 60px; display: inline-block;">Octave</label>
          <select style="width: 50px;" class="select-octave">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        <div>
        <button style="width: 100%; margin-top: 5px;" class="button-delete">Delete</button>
        <button style="width: 100%; margin-top: 5px;" class="button-close">Close</button>
      <div>
    `
  }
}

export { NoteMenuOverlay }