// draw a box falling down using acceleration; displaying acceleration and velocity

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const MOON_GRAVITY_ACCELERATION = 1.64 // m/s/s
const BOOSTER_ACCELERATION = 2 * MOON_GRAVITY_ACCELERATION
let velocity = 0

const KEYS = new Set()

const BOX_SIZE = 20
const HALF_BOX_SIZE = BOX_SIZE / 2
const GROUND = canvas.height - BOX_SIZE * 2
let boxX = canvas.width / 2
let boxY = BOX_SIZE * 2

// key codes
const UP_ARROW = 38
const LEFT_ARROW = 37
const RIGHT_ARROW = 39

let isRunning = true

const update = (tick, lastTick) => {
  const pctOfASecond = (tick - lastTick) / 1000
  velocity += pctOfASecond * MOON_GRAVITY_ACCELERATION
  if (KEYS.has(UP_ARROW)) {
    velocity -= pctOfASecond * BOOSTER_ACCELERATION
  }
  boxY += velocity
  if (boxY > GROUND - HALF_BOX_SIZE) {
    boxY = GROUND - HALF_BOX_SIZE
    velocity = 0
  }
  if (KEYS.has(LEFT_ARROW)) {
    boxX -= 1
  }
  if (KEYS.has(RIGHT_ARROW)) {
    boxX += 1
  }
}

const draw = (tick, lastTick) => {
  // clear background
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw ground
  ctx.strokeStyle = 'white'
  ctx.beginPath()
  ctx.moveTo(0, GROUND)
  ctx.lineTo(canvas.width, GROUND)
  ctx.stroke()
  
  // draw box
  ctx.fillStyle = '#FFBF00'  
  ctx.fillRect(boxX - HALF_BOX_SIZE, boxY - HALF_BOX_SIZE, BOX_SIZE, BOX_SIZE)

  // draw booster jet
  if (KEYS.has(UP_ARROW)) {
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(boxX - (HALF_BOX_SIZE * 0.5), boxY + BOX_SIZE * 0.75)
    ctx.lineTo(boxX + (HALF_BOX_SIZE * 0.5), boxY + BOX_SIZE * 0.75)
    ctx.lineTo(boxX, boxY + BOX_SIZE * 2)
    ctx.fill()
  }

  // draw text
  ctx.font = '20px JetBrainsMono-Regular'
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'white'
  ctx.fillText(`VELOCITY: ${~~(velocity * 100) / 100}`, 20, 20)
  ctx.fillText(`HEIGHT AGL: ${~~(GROUND - boxY - HALF_BOX_SIZE)}`, 20, 50)
}

let lastTick = 0;
const loop = (tick) => {
  if (isRunning) {
    update(tick, lastTick)
  }
  draw(tick, lastTick)
  lastTick = tick
  requestAnimationFrame(loop)
}


const onKeyDown = (e) => {
  KEYS.add(e.which)
}
const onKeyUp = (e) => {
  KEYS.delete(e.which)
}

(function init() {
  console.log('Gravity PoC')
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  requestAnimationFrame(loop)
})()
