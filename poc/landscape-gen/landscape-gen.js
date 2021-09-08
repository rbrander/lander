// landscape-gen.js module

import randomGen from './random.js'

const MAX_CANVAS_WIDTH = 2**15 - 1

export const generateHeights = (seed = 1, numHeights = 0, maxLength = 1, maxHeight = 1) => {
  const values = []
  const random = () => randomGen(seed)
  for (let i = 0; i < numHeights; i++) {
    const length = ~~(random() * maxLength) + 1
    let height = ~~(random() * maxHeight)
    if (i > 0) {
      // ensure the new height isn't the same as the previous height
      if (height === values[i - 1].height) {
        if (height > 0) {
          height--
        } else {
          height++
        }
      }
    }
    values.push({ length, height })
  }
  return values
}

export const generateLandscape = (canvas, heights) => {
  const maxHeight = heights.reduce((max, { height }) => max > height ? max : height, 0)
  const maxWidth = heights.reduce(
    (sum, { length, height }, idx, arr) => {
      let nextSum = length + sum
      if (idx > 0) {
        // add in half the width of the diffence in height between previous and current
        const diff = Math.abs(height - arr[idx - 1].height)
        nextSum += (diff / 2)
      }
      return nextSum
    }, 0)

  // resize the canvas
  canvas.width = Math.min(~~maxWidth + 1, MAX_CANVAS_WIDTH)
  canvas.height = maxHeight
  console.log(`landscape canvas (${canvas.width} x ${canvas.height})`)

  // Now that the canvas is initialized, get the context
  const ctx = canvas.getContext('2d', { alpha: false })

  // clear canvas
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw the platforms and connecting slopes
  let prevHeight
  let x = 0
  ctx.strokeStyle = 'white'
  for (let { length, height } of heights) {
    if (prevHeight !== undefined) {
      const halfHeightDiff = ~~Math.abs((height - prevHeight) / 2)
      ctx.beginPath()
      ctx.moveTo(x, prevHeight)
      ctx.lineTo(x + halfHeightDiff, height)
      ctx.stroke()
      x += halfHeightDiff
    }
    ctx.beginPath()
    ctx.moveTo(x, height)
    ctx.lineTo(x + length, height)
    ctx.stroke()
    prevHeight = height
    x += length
    if (x > canvas.width) {
      break
    }
  }
}
