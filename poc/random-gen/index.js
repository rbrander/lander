const random = require('./random')

console.log('Random test')

let SEEDS = [0, 1, 2, 1]

for (seed of SEEDS) {
  console.log(`\nSeed ${seed}`)
  for (let i = 0; i < 5; i ++) {
    console.log(`${i} = ${random(seed)}`)
  }
}
