/*
Create a function to generate a landscape with a given seed. 

4 |---------.                          
3 |          \           .------.      
2 |           \         /        \     
1 |            \       /          `----
0 |_____________`-----'________________
  0123456789012345678901234567890123456
  0000000000111111111122222222223333333
               
[
  { length: 9, height: 1.0 },
  { length: 5, height: 0.0 },
  { length: 6, height: 0.75 },
  { length: 4, height: 0.25 }
]

*/
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const randomGen = require('../random-gen/random')
const SEED = 12345
const random = () => randomGen(SEED)

const MAX_CHARS_PER_ROW = 119

const MAX_LENGTH = 10
const MAX_HEIGHT = 15

// TODO: fix the case where two consequtive values could have same height

const generateHeights = (totalLength, maxLength = 1, maxHeight = 1) => {
  const values = []
  while (true) {
    values.push({
      length: ~~(random() * maxLength) + 1,
      height: ~~(random() * maxHeight)
    })
    // check the sum of the lengths
    const lengthSum = values.reduce((lengthSum, value) => (lengthSum + value.length), 0)
    if (lengthSum > totalLength) {
      const lastValue = values[values.length - 1]
      const withoutLastValue = lengthSum - lastValue.length
      const remaining = totalLength - withoutLastValue
      lastValue.length = remaining
      break;
    }
  }
  return values
}

/*
const max = 10**3
const start = Date.now()

let lastNumber
for (let i = 0; i < max; i++) {
  lastNumber = random(SEED, false)
}

console.log(`took ${Date.now() - start} ms`)
*/


/*
sample landscape = [
  {
    "length": 6,
    "height": 1
  },
  {
    "length": 6,
    "height": 4
  },
  {
    "length": 6,
    "height": 3
  },
  {
    "length": 1,
    "height": 4
  },
  {
    "length": 6,
    "height": 4
  }
]
*/

const generateLandscape = (heights, maxHeight) => {
  // calculate the width needed to store all the characters
  // by adding all the lengths together as well as the differnce in
  // heights as that is used for the slopes
  const width = heights.reduce((width, curr, idx, arr) => {
    let slope = 0
    if (idx > 0) {
      // add slope
      slope = Math.abs(arr[idx].height - curr.height)
      if (slope > 0) slope++
    }
    return width + slope + curr.length
  }, 0)
  
  // Create a 2D array to store the characters for display
  // NOTE: outputChars is [y][x] (rows, cols)
  const outputChars = new Array(maxHeight)
    .fill().map(() => new Array(width).fill(' '))

  const addChar = (char, height) => {
    if (x < width && height < maxHeight) {
      outputChars[height][x++] = char
    }
  }

  let prevHeight
  let x = 0
  for ({ length, height } of heights) {
    // draw a slope to the new height
    if (prevHeight !== undefined && prevHeight !== height) {
      // draw the slope from prevHeight to height
      const diff = prevHeight - height
      const isDown = (diff < 0)
      const absDiff = Math.abs(diff) + 1
      for (let i = 0; i < absDiff; i++) {
        let char = isDown ? '\\' : '/'
        if (i === 0) {
          char = isDown ? '.' : '\''
        } else if (i === absDiff - 1) {
          char = isDown ? '`' : '.'
        }
        addChar(char, prevHeight + ((isDown ? 1 : -1) * i))
      }
    }

    // draw platform
    for (let i = 0; i < length; i++) {
      addChar('-', height)
    }

    // update height for next iteration
    prevHeight = height
  }

  return outputChars
}


let offset = 0
const drawLandscape = (landscape, width = MAX_CHARS_PER_ROW) => {
  console.clear()
  for (let i = 0; i < 20; i++) {
    console.log()
  }
  for (row of landscape) {
    console.log(
      row
        .filter((_, idx) => (idx >= offset && idx < offset + width))
        .join('')
    )
  }
}


// init
const generatedHeights = generateHeights(100000, MAX_LENGTH, MAX_HEIGHT)
const landscape = generateLandscape(generatedHeights, MAX_HEIGHT)
drawLandscape(landscape)



process.stdin.on('keypress', (str, key) => {
  if ((key.ctrl && key.name === 'c') || key.name === 'escape' || key.name === 'q') {
    process.exit();
  } else {
    switch (key.name) {
      case 'left':
      case 'a':
        if (offset > 0) {
          offset--
          drawLandscape(landscape)        
        }
        break
      case 'right':
      case 'd':
        offset++
        drawLandscape(landscape)        
        break
      default:
        console.log('keypress: key =', key, 'str =', str)
        break
    }
  }
});

