class Observable<T, K extends keyof T> {

  props : T

  constructor(props : T) {
    this.props = props
  }

  set(values: {[key: string]: any }) {
    Object.assign(this.props, values)
    console.log(['test', this.props])
  }

  get vals() : T {
    return this.props
  }
}

export { Observable }