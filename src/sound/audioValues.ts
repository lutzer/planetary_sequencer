const scales : number[][] = [
  [0,4,9],            // major chord
  [0,3,7],             // minor chord
  [0,2,4,5,7,9,10]    // major

]

const rythms : { distances: number[], divisor: number }[]  = [
  {
    distances: [1,8/20,4/20],
    divisor: 8
  },
  {
    distances: [1,1/2,1/4],
    divisor: 8
  },
  {
    distances: [1,1/3,1/6],
    divisor: 6
  }
  
]

export { scales, rythms }