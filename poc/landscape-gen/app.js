// landscape generator
import { generateHeights, generateLandscape } from './landscape-gen.js'

const seedInput = document.getElementById('seed')
const offsetInput = document.getElementById('offset')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', { alpha: false })
let landscape_heights = []
let mouseOnCanvas = false
let mousePosition = ''

const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

const KEYS = new Set() // holds a list of keyboard keys that are currently down
let SEED = 12345
const MAX_LENGTH = 200
const MAX_HEIGHT = 400
const NUM_HEIGHTS_TO_GENERATE = 300
let offset = 15171 //2**14 // half of a max canvas width

const LEFT_ARROW = 37
const RIGHT_ARROW = 39

const update = (tick) => {
  if (KEYS.has(LEFT_ARROW)) {
    offset -= 10
    offsetInput.value = offset
  }
  if (KEYS.has(RIGHT_ARROW)) {
    offset += 10
    offsetInput.value = offset
  }
}

const draw = (tick) => {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.drawImage(offscreenCanvas,
    // Source (x, y, width, height)
    offset, 0, canvas.width, canvas.height,
    // Destination (x, y, width, height)
    0, 100, canvas.width, canvas.height
  )

  ctx.font = '20px JetBrainsMono-Regular'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'
  ctx.fillText(mousePosition, 20, 20)
}

const loop = (tick) => {
  update(tick)
  draw(tick)
  requestAnimationFrame(loop)
}

const DECIMAL_RADIX = 10
const updateSeed = (seedStr = SEED.toString()) => {
  SEED = Math.abs(parseInt(seedStr, DECIMAL_RADIX))
  landscape_heights = generateHeights(SEED, NUM_HEIGHTS_TO_GENERATE, MAX_LENGTH, MAX_HEIGHT)
  generateLandscape(offscreenCanvas, landscape_heights)
}

const updateOffset = (offsetStr = offset.toString()) => {
  offset = Math.abs(parseInt(offsetStr, DECIMAL_RADIX)) 
}

const onKeyDown = (e) => { KEYS.add(e.which) }
const onKeyUp = (e) => { KEYS.delete(e.which) }

const onMouseMove = (e) => { mousePosition = `Mouse: ${e.offsetX}, ${e.offsetY}` }
const onMouseLeave = (e) => { mousePosition = '' }

(function init() {
  console.log('Landscape PoC')
  
  seedInput.value = SEED
  seedInput.addEventListener('change', (e) => { updateSeed(e.target.value) })
  updateSeed()

  offsetInput.value = offset
  offsetInput.addEventListener('change', (e) => { updateOffset(e.target.value) })
  updateOffset()

  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  canvas.addEventListener('mouseleave', onMouseLeave)
  canvas.addEventListener('mousemove', onMouseMove)
  
  requestAnimationFrame(loop)
})()
