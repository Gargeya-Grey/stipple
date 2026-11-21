// Draws the mod's icon as tools/icon.svg: the backdrop's climb, built from its glyphs. Worn stone steps rise to
// the vermilion torii, then lit flights zigzag up through two smaller, farther gates to a star.
// Run: node tools/icon.mjs, then render the SVG to .claude-plugin/icon.png at 1024 x 1024 (see README).
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GLYPHS, climbCells } from './art.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const glyph = new Map(GLYPHS.map(([ch, , rows]) => [ch, rows]))

const SIZE = 1024
const N = 52
const CELL = SIZE / N
const P = CELL / 7.6

const GROUND = '#1A201E'
const VERMILION = '#DF6B3F'
const EMBER = '#E78954'
const LIGHT = '#F2B86B'
const STONE = '#75857D'
const MOSS = '#448069'
const FIREFLY = '#56C495'
const SPECK = '#5E6B65'
const INK = {
  1: [MOSS, 1],
  2: [MOSS, 1],
  4: [VERMILION, 1],
  6: [EMBER, 1],
  8: [STONE, 0.9],
  9: [LIGHT, 1],
  10: ['#853B24', 1],
  11: ['#46514C', 1],
  12: [VERMILION, 0.8],
  13: [VERMILION, 0.65],
}

// Cells count cx across from the left and cy up from the bottom, as in the backdrop.
const cellX = cx => cx * CELL
const cellY = cy => SIZE - (cy + 1) * CELL
const centre = (cx, cy) => [(cellX(cx) + CELL / 2).toFixed(1), (cellY(cy) + CELL / 2).toFixed(1)]

const pixels = (ch, cx, cy, fill, opacity = 1) => {
  const rows = glyph.get(ch)
  if (rows === undefined) throw new Error(`unknown glyph ${ch}`)
  const side = (P * 0.84).toFixed(2)
  let d = ''
  rows.forEach((line, row) =>
    [...line].forEach((bit, col) => {
      if (bit !== '#') return
      const x = cellX(cx) + (CELL - 5 * P) / 2 + col * P
      const y = cellY(cy) + (CELL - 7 * P) / 2 + row * P
      d += `M${x.toFixed(1)} ${y.toFixed(1)}h${side}v${side}h-${side}z`
    }),
  )
  return d === '' ? '' : `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`
}

// The climb as the backdrop places it, packed closer so all three gates fit the square.
const c1 = 31
const c2 = 13
const c3 = 30
const b1 = 4
const { cells, covered } = climbCells(
  { c1, c2, c3, b1, gap2: 5, gap3: 4, foot: [c1 - 4, -3, 16], cols: N, rows: N },
  (cx, cy) => (((cx * 73 + cy * 151) % 97) + 0.5) / 97,
)

const parts = []
const blocks = { near: '', far: '' }
for (const [key, { ch, k }] of cells) {
  const [cx, cy] = key.split(',').map(Number)
  const [fill, opacity] = INK[k]
  parts.push(pixels(ch, cx, cy, fill, opacity))
  // A faint block behind the timber keeps each gate solid when the icon is small.
  const block = `M${cellX(cx).toFixed(1)} ${cellY(cy).toFixed(1)}h${CELL.toFixed(1)}v${CELL.toFixed(1)}h-${CELL.toFixed(1)}z`
  if (k === 4 || k === 6) blocks.near += block
  if (k === 12 || k === 13) blocks.far += block
}

// Fireflies and specks from fixed lists, so the icon is the same on every run.
const FLIES = [
  [4, 30],
  [47, 36],
  [6, 12],
  [48, 8],
]
const glows = FLIES.map(([cx, cy]) => {
  const [x, y] = centre(cx, cy)
  return `<circle cx="${x}" cy="${y}" r="${(CELL * 1.8).toFixed(1)}" fill="url(#fly)"/>`
})
FLIES.forEach(([cx, cy]) => parts.push(pixels('+', cx, cy, FIREFLY)))
const SPECKS = [
  [3, 47, '.'],
  [9, 42, '`'],
  [22, 49, '.'],
  [44, 46, '`'],
  [49, 27, '.'],
  [2, 22, '.'],
  [41, 50, '.'],
  [18, 36, '`'],
]
SPECKS.forEach(([cx, cy, ch]) => covered.has(`${cx},${cy}`) || parts.push(pixels(ch, cx, cy, SPECK, 0.8)))

const [gx, gy] = centre(c1, b1 + 9)
const [sx, sy] = centre(c3, b1 + 17 + 5 + 9 + 4 + 6 + 3)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<defs>
<radialGradient id="warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${VERMILION}" stop-opacity="0.24"/><stop offset="1" stop-color="${VERMILION}" stop-opacity="0"/></radialGradient>
<radialGradient id="star" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${LIGHT}" stop-opacity="0.5"/><stop offset="1" stop-color="${LIGHT}" stop-opacity="0"/></radialGradient>
<radialGradient id="fly" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${FIREFLY}" stop-opacity="0.35"/><stop offset="1" stop-color="${FIREFLY}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${SIZE}" height="${SIZE}" fill="${GROUND}"/>
<ellipse cx="${gx}" cy="${gy}" rx="${(CELL * 16).toFixed(1)}" ry="${(CELL * 13).toFixed(1)}" fill="url(#warm)"/>
<circle cx="${sx}" cy="${sy}" r="${(CELL * 4).toFixed(1)}" fill="url(#star)"/>
${glows.join('\n')}
<path d="${blocks.near}" fill="${VERMILION}" opacity="0.24"/>
<path d="${blocks.far}" fill="${VERMILION}" opacity="0.14"/>
${parts.join('\n')}
</svg>
`
writeFileSync(join(root, 'tools', 'icon.svg'), svg)
console.log(`icon.svg ${svg.length} characters`)
