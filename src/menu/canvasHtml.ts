import _ from "lodash"

function getStyleString(style : {[key: string] : string}) : string {
  return _.reduce(style, (acc, val, key) => {
    acc += `${key} : ${val};`
    return acc
  },'')
}

class CanvasHtml {

  htmlElement : HTMLDivElement = null

  style : any = {}

  constructor(id : string) {
    this.htmlElement = document.createElement('div')
    this.htmlElement.id = id

    // set style
    this.htmlElement.setAttribute('style', getStyleString(this.style))

    //set inner element
    this.htmlElement.innerHTML = this.render()
  }

  get domElement() : HTMLDivElement {
    return this.htmlElement
  }

  addListener(className : string, event: string, listener : (...args : any) => void) {
    if (!className)
      this.htmlElement.addEventListener(event, listener)
    else
      this.htmlElement.getElementsByClassName(className)[0].addEventListener(event, listener)
  }

  getChildElement(className : string) : HTMLElement {
    return <HTMLElement>this.htmlElement.getElementsByClassName(className)[0]
  }

  render() : string { 
    return ''
  }
}

export { CanvasHtml, getStyleString }