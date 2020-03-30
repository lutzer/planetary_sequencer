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

    window.addEventListener('load', () => {
      this.adjustSize()
    })
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

  adjustSize() {
    this.canvas.style.maxWidth = window.innerWidth*0.9 < this.width ? (window.innerWidth*0.9) + 'px' : 'none'
    this.canvas.style.maxHeight = window.innerHeight*0.9 < this.height ? (window.innerHeight*0.9) + 'px' : 'none'
  }

  
}

export { Stage }