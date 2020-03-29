class Stage {
  canvas : any

  constructor({id = 'canvas', width = 512, height = 512}) {
    this.canvas = document.getElementById(id)
    this.canvas.width = width
    this.canvas.height = height
  }

  get context() : CanvasRenderingContext2D {
    return this.canvas.getContext('2d')
  }

  get height() : number {
    return this.canvas.height
  }

  get width() : number {
    return this.canvas.width
  }
}

export { Stage }