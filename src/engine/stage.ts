import { CanvasMouseHandler, CanvasMouse } from "./canvasMouse"

class Stage {
  canvasElement : HTMLCanvasElement
  containerElement : HTMLDivElement

  aspectRatio : number

  scale : number = 1

  private mouseHandler : CanvasMouse

  constructor({id = 'canvas', width = 512, height = 512}) {
    this.containerElement = <HTMLDivElement>document.getElementById(id)
    this.canvasElement = document.createElement('canvas')
    this.container.appendChild(this.canvas)

    this.canvasElement.width = width
    this.canvasElement.height = height

    this.aspectRatio = width/height
    
    window.addEventListener('resize', () => {
      this.adjustSize()
    })

    this.adjustSize()

    this.canvasElement.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      return false
    })

    this.mouseHandler = new CanvasMouse(this)
  }

  get canvas() : HTMLCanvasElement {
    return this.canvasElement
  }

  get container() : HTMLDivElement {
    return this.containerElement
  }

  onMouseEvent(listener: CanvasMouseHandler) {
    this.mouseHandler.listener = listener
  }

  get renderer() : CanvasRenderingContext2D {
    return <CanvasRenderingContext2D>this.canvasElement.getContext('2d', {})
  }

  get height() : number {
    return this.canvasElement.height
  }

  get width() : number {
    return this.canvasElement.width
  }

  get maxSide() : number {
    return Math.max(this.width, this.height)
  }

  adjustSize() {
    var scale = Math.min(window.innerWidth*0.9 / this.width, window.innerHeight*0.9 / this.height)  
    this.canvasElement.style.width = (scale < 1.0 ? this.width * scale : this.width) + 'px'
    this.canvasElement.style.height = (scale < 1.0 ? this.height * scale * this.aspectRatio : this.height) + 'px'

    this.scale = this.width / this.canvasElement.clientWidth 
  }

  
}

export { Stage }