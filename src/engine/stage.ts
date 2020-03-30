class Stage {
  canvas : HTMLCanvasElement
  aspectRatio : number

  constructor({id = 'canvas', width = 512, height = 512}) {
    this.canvas = <HTMLCanvasElement>document.getElementById(id)
    this.canvas.width = width
    this.canvas.height = height

    this.aspectRatio = width/height
    
    window.addEventListener('resize', () => {
      this.adjustSize()
    })

    this.adjustSize()
  }

  get renderer() : CanvasRenderingContext2D {
    return <CanvasRenderingContext2D>this.canvas.getContext('2d', {
      antialias: true,
      willReadFrequently: true
    })
  }

  get height() : number {
    return this.canvas.height
  }

  get width() : number {
    return this.canvas.width
  }

  get maxSide() : number {
    return Math.max(this.width, this.height)
  }

  adjustSize() {
    var scale = Math.min(window.innerWidth*0.9 / this.width, window.innerHeight*0.9 / this.height)  
    this.canvas.style.width = (scale < 1.0 ? this.width * scale : this.width) + 'px'
    this.canvas.style.height = (scale < 1.0 ? this.height * scale * this.aspectRatio : this.height) + 'px'
  }

  
}

export { Stage }