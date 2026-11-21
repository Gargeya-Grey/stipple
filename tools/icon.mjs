// Draws the mod's icon, the torii built from glyphs, as tools/icon.svg.
// Run: node tools/icon.mjs, then render the SVG to .claude-plugin/icon.png at 1024 x 1024 (see README).
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GLYPHS, TORII } from './art.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const glyph = new Map(GLYPHS.map(([ch, , rows]) => [ch, rows]))

const SIZE = 1024
const P = 4.4
const CW = 6 * P
const CH = 9 * P
const x0 = (SIZE - 24 * CW) / 2
const y0 = 176

const GROUND = '#1A201E'
const VERMILION = '#DF6B3F'
const EMBER = '#E78954'
const MOSS = '#448069'
const FIREFLY = '#56C495'
const SPECK = '#5E6B65'

const cellX = c => x0 + c * CW
const cellY = r => y0 + r * CH

const pixels = (ch, c, r, fill, opacity = 1) => {
  const rows = glyph.get(ch)
  if (rows === undefined) throw new Error(`unknown glyph ${ch}`)
  let d = ''
  rows.forEach((line, row) =>
    [...line].forEach((bit, col) => {
      if (bit !== '#') return
      const x = cellX(c) + 0.5 * P + col * P
      const y = cellY(r) + P + row * P
      d += `M${x.toFixed(1)} ${y.toFixed(1)}h${(P * 0.84).toFixed(2)}v${(P * 0.84).toFixed(2)}h-${(P * 0.84).toFixed(2)}z`
    }),
  )
  return d === '' ? '' : `<path d="${d}" fill="${fill}" opacity="${opacity}"/>`
}

const parts = []
const blocks = []
TORII.forEach((line, r) =>
  [...line.padEnd(24, ' ')].forEach((ch, c) => {
    if (ch === ' ') return
    const ground = r === TORII.length - 1
    const tablet = r >= 3 && r <= 4 && c >= 10 && c <= 13
    const fill = ground ? MOSS : tablet ? EMBER : VERMILION
    if (!ground) blocks.push(`M${cellX(c).toFixed(1)} ${cellY(r).toFixed(1)}h${CW.toFixed(1)}v${CH.toFixed(1)}h-${CW.toFixed(1)}z`)
    parts.push(pixels(ch, c, r, fill))
  }),
)

// Fireflies, in cell coordinates of the gate's grid; the ones between the pillars are the portal lights.
const FLIES = [
  [-5, 7],
  [27, 3],
  [11, 8],
  [13, 11],
  [-3, 14],
  [28, 12],
  [8, 13],
]
const glows = FLIES.map(
  ([c, r]) => `<circle cx="${(cellX(c) + CW / 2).toFixed(1)}" cy="${(cellY(r) + CH / 2).toFixed(1)}" r="${(CW * 1.6).toFixed(1)}" fill="url(#fly)"/>`,
)
FLIES.forEach(([c, r]) => parts.push(pixels('+', c, r, FIREFLY)))

// Specks of dust off the gate, from a fixed list so the icon is the same on every run.
const SPECKS = [
  [-6, 1, '.'],
  [-4, 4, '`'],
  [26, 0, '.'],
  [29, 7, '.'],
  [-6, 11, '.'],
  [30, 15, '`'],
  [-1, 17, '.'],
  [25, 17, '.'],
  [2, -2, '`'],
  [20, -2, '.'],
]
SPECKS.forEach(([c, r, ch]) => parts.push(pixels(ch, c, r, SPECK, 0.8)))

const beamY = cellY(1)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<defs>
<radialGradient id="warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${VERMILION}" stop-opacity="0.28"/><stop offset="1" stop-color="${VERMILION}" stop-opacity="0"/></radialGradient>
<radialGradient id="portal" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${FIREFLY}" stop-opacity="0.16"/><stop offset="1" stop-color="${FIREFLY}" stop-opacity="0"/></radialGradient>
<radialGradient id="fly" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${FIREFLY}" stop-opacity="0.35"/><stop offset="1" stop-color="${FIREFLY}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${SIZE}" height="${SIZE}" fill="${GROUND}"/>
<ellipse cx="${SIZE / 2}" cy="${(beamY + CH).toFixed(1)}" rx="${(SIZE * 0.46).toFixed(1)}" ry="${(SIZE * 0.24).toFixed(1)}" fill="url(#warm)"/>
<ellipse cx="${SIZE / 2}" cy="${cellY(11).toFixed(1)}" rx="${(CW * 6).toFixed(1)}" ry="${(CH * 6).toFixed(1)}" fill="url(#portal)"/>
${glows.join('\n')}
<path d="${blocks.join('')}" fill="${VERMILION}" opacity="0.24"/>
${parts.join('\n')}
</svg>
`
writeFileSync(join(root, 'tools', 'icon.svg'), svg)
console.log(`icon.svg ${svg.length} characters`)
