// The glyph font and the torii drawing, shared by build.mjs (the backdrop) and icon.mjs (the mod's icon).
export const GLYPHS = [
  [' ', 'SPACE', ['.....', '.....', '.....', '.....', '.....', '.....', '.....']],
  ['.', 'DOT', ['.....', '.....', '.....', '.....', '.##..', '.##..', '.....']],
  [',', 'COMMA', ['.....', '.....', '.....', '.....', '..##.', '..##.', '.##..']],
  ['`', 'TICK', ['.#...', '..#..', '.....', '.....', '.....', '.....', '.....']],
  ['-', 'DASH', ['.....', '.....', '.....', '#####', '.....', '.....', '.....']],
  ['=', 'EQ', ['.....', '.....', '#####', '.....', '#####', '.....', '.....']],
  ['~', 'TILDE', ['.....', '.....', '.#...', '#.#.#', '...#.', '.....', '.....']],
  ['_', 'UNDER', ['.....', '.....', '.....', '.....', '.....', '.....', '#####']],
  ['|', 'PIPE', ['..#..', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..']],
  ['/', 'SLASH', ['....#', '...#.', '...#.', '..#..', '.#...', '.#...', '#....']],
  ['\\', 'BACK', ['#....', '.#...', '.#...', '..#..', '...#.', '...#.', '....#']],
  ['^', 'CARET', ['..#..', '.#.#.', '#...#', '.....', '.....', '.....', '.....']],
  ['A', 'A', ['..#..', '.#.#.', '#...#', '#...#', '#####', '#...#', '#...#']],
  ['*', 'STAR', ['.....', '..#..', '#.#.#', '.###.', '#.#.#', '..#..', '.....']],
  ['+', 'PLUS', ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....']],
  ['#', 'HASH', ['.#.#.', '.#.#.', '#####', '.#.#.', '#####', '.#.#.', '.#.#.']],
  ['[', 'OPEN', ['###..', '#....', '#....', '#....', '#....', '#....', '###..']],
  [']', 'CLOSE', ['..###', '....#', '....#', '....#', '....#', '....#', '..###']],
  ['Y', 'Y', ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..']],
  [':', 'COLON', ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....']],
  ['o', 'O', ['.....', '.....', '.###.', '#...#', '#...#', '.###.', '.....']],
  ['%', 'PCT', ['##...', '##..#', '...#.', '..#..', '.#...', '#..##', '...##']],
  ['&', 'AMP', ['.##..', '#..#.', '#.#..', '.#...', '#.#.#', '#..#.', '.##.#']],
  ['@', 'AT', ['.###.', '#...#', '#.###', '#.#.#', '#.###', '#....', '.###.']],
  ['x', 'X', ['.....', '.....', '#...#', '.#.#.', '..#..', '.#.#.', '#...#']],
  ['v', 'V', ['.....', '.....', '#...#', '#...#', '.#.#.', '.#.#.', '..#..']],
  ['!', 'BANG', ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..']],
  [';', 'SEMI', ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.#...']],
  ['木', 'KI', ['..#..', '#####', '..#..', '.###.', '#.#.#', '..#..', '..#..']],
  ['山', 'YAMA', ['..#..', '..#..', '#.#.#', '#.#.#', '#.#.#', '#####', '.....']],
  ['人', 'HITO', ['..#..', '..#..', '..#..', '.#.#.', '.#.#.', '#...#', '#...#']],
  ['"', 'QUOTE', ['.#.#.', '.#.#.', '.....', '.....', '.....', '.....', '.....']],
]

export const TORII = [
  '~=._                _.=~',
  ' =####################= ',
  '  ====================  ',
  '    |#|   [##]   |#|    ',
  '    |#|   [__]   |#|    ',
  '  =#|#|##########|#|#=  ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '    |#|          |#|    ',
  '   [###]        [###]   ',
  ' .,~-~,..  .  ..,~-~,.  ',
]

// The climb: three flights of steps zigzag up through three torii, each gate smaller and farther than the last.
// hooks/field.ts draws the same scene in the shader with the same numbers; change both together.
export const HALF_GATE = 8.5
const S2 = 0.55
const S3 = 0.36
const SQUEEZE = 1.3
const [N1, N2, N3] = [12, 6, 5]
const stepsAt = (t, count) => (count * -Math.log(Math.max(1 - Math.min(Math.max(t, 0), 1) * (1 - Math.exp(-SQUEEZE)), 0.0001))) / SQUEEZE
const onFlight = (cx, cy, a, b, count) => {
  const t = (cy + 0.5 - a[1]) / (b[1] - a[1])
  const mid = a[0] + (b[0] - a[0]) * t
  const half = a[2] + (b[2] - a[2]) * t
  const sx = cx + 0.5 - mid
  const inside = t >= 0 && t <= 1 && Math.abs(sx) <= half - 0.01
  const rail = Math.abs(sx) >= half - 1 ? Math.sign(sx) || 1 : 0
  const n0 = stepsAt((cy - a[1]) / (b[1] - a[1]), count)
  const n1 = stepsAt((cy + 1 - a[1]) / (b[1] - a[1]), count)
  return { inside, rail, tread: Math.floor(n0) < Math.floor(n1), n: Math.floor(n1) }
}
const smallTorii = (cx, cy, gc, top, half, tall) => {
  const dx = Math.abs(cx - gc)
  const r = top - cy
  const legs = Math.floor(half * 0.62 + 0.5)
  const nuki = Math.floor(tall * 0.32) + 1
  if (r < 0 || r > tall - 1 || dx > half) return null
  if (r === 0) return { ch: dx > half - 0.5 ? '~' : '#', tablet: false }
  if (r >= 2 && dx === legs) return { ch: '|', tablet: false }
  if (r === 1 && dx <= half - 1) return { ch: '=', tablet: false }
  if (r === nuki && dx <= legs + 1) return { ch: '=', tablet: false }
  if (r >= 2 && r < nuki && dx === 0) return { ch: '#', tablet: true }
  return null
}
const railGlyph = slope => (slope > 0.3 ? '/' : slope < -0.3 ? '\\' : '|')
const toriiAt = (cx, cy, x0, top, s) => {
  const gx = Math.floor((cx - x0) / s + 0.001)
  const gr = Math.floor((top - cy) / s + 0.001)
  if (gx < 0 || gx > 23 || gr < 0 || gr > 17) return null
  const ch = TORII[gr].padEnd(24, ' ')[gx]
  return ch === ' ' ? null : { ch, gr, gx }
}

// The climb's cells, with cy counted up from the bottom row. Gate centres c1 to c3 and gate 1's foot row b1 place
// it; gap2 and gap3 are the rows between a roof and the next flight's head; foot is flight 1's [x, y, half width].
// roll(cx, cy) is the cell's fixed random number in [0, 1). Returns cells as "cx,cy" to { ch, k }, and covered,
// every cell the climb hides, drawn or bare. Kinds: 1 ground, 2 moss, 4 timber, 6 tablet, 8 stone, 9 light,
// 10 timber shade, 11 stone sides, 12 and 13 the far gates.
export const climbCells = ({ c1, c2, c3, b1, gap2, gap3, foot, cols, rows }, roll) => {
  const top1 = b1 + 17
  const b2 = top1 + gap2
  const top2 = b2 + Math.floor(17 * S2)
  const b3 = top2 + gap3
  const top3 = b3 + Math.floor(17 * S3)
  // Far to near, so a nearer piece covers a farther one.
  const FLIGHTS = [
    { a: [c2 + 1, top2 + 0.5, 4.5], b: [c3, b3 + 0.5, HALF_GATE * S3], count: N3, s: S3, gc: c3, top: top3 },
    { a: [c1 - 2, top1 + 0.5, 7], b: [c2, b2 + 0.5, HALF_GATE * S2], count: N2, s: S2, gc: c2, top: top2 },
    { a: foot, b: [c1, b1 + 0.5, HALF_GATE], count: N1, s: 1, gc: c1, top: top1 },
  ]
  const cells = new Map()
  const covered = new Set()
  const put = (cx, cy, ch, k) => {
    if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) return
    cells.set(`${cx},${cy}`, { ch, k })
    covered.add(`${cx},${cy}`)
  }
  const clear = (cx, cy) => {
    cells.delete(`${cx},${cy}`)
    covered.add(`${cx},${cy}`)
  }

  put(c3, Math.min(top3 + 3, rows - 2), '*', 9)
  FLIGHTS.forEach(({ a, b, count, s, gc, top }, q) => {
    const thick = q < 2 ? 1 : 2
    const lo = Math.floor(Math.min(a[0] - a[2], b[0] - b[2])) - 2
    const hi = Math.ceil(Math.max(a[0] + a[2], b[0] + b[2])) + 2
    for (let cy = Math.max(0, Math.floor(a[1]) - thick - 1); cy <= Math.min(rows - 1, Math.ceil(b[1]) + 1); cy++) {
      for (let cx = Math.max(0, lo); cx <= Math.min(cols - 1, hi); cx++) {
        const r1 = roll(cx, cy)
        const here = onFlight(cx, cy, a, b, count)
        if (!here.inside) {
          if (onFlight(cx, cy + thick, a, b, count).inside) {
            clear(cx, cy)
            put(cx, cy, r1 < 0.55 ? '|' : ':', q < 2 ? 10 : 11)
          }
          continue
        }
        clear(cx, cy)
        const lit = q < 2
        const k = lit ? 9 : 8
        const slope = (b[0] - a[0] + here.rail * (b[2] - a[2])) / (b[1] - a[1])
        if (here.rail !== 0) {
          const lamp = lit && here.tread && here.n % (q === 0 ? 2 : 3) === 0
          put(cx, cy, lamp ? '*' : railGlyph(slope), k)
        } else if (here.tread) {
          put(cx, cy, !lit && r1 < 0.14 ? '-' : '=', k)
        } else if (!lit && r1 < 0.035) {
          put(cx, cy, 'v', 2)
        } else if (!lit && r1 < 0.12) {
          put(cx, cy, '.', k)
        }
      }
    }
    const half = Math.floor(12 * s)
    const tall = Math.floor(17 * s) + 1
    for (let cy = top - 19; cy <= top; cy++) {
      for (let cx = gc - 14; cx <= gc + 14; cx++) {
        let front = null
        let back = null
        if (q === 2) {
          const f = toriiAt(cx, cy, gc - 12, top, 1)
          const bk = toriiAt(cx - 1, cy + 1, gc - 12, top, 1)
          if (f) front = { ch: f.ch, k: f.gr === 17 ? 1 : f.gr >= 3 && f.gr <= 4 && f.gx >= 10 && f.gx <= 13 ? 6 : 4 }
          // The timber's thickness shows beside the pillars and their bases only; under the beams it doubles them.
          const pillarCol = bk && ((bk.gx >= 3 && bk.gx <= 7) || (bk.gx >= 16 && bk.gx <= 20))
          if (bk && bk.gr >= 3 && bk.gr < 17 && pillarCol) back = bk
        } else {
          const f = smallTorii(cx, cy, gc, top, half, tall)
          if (f) front = { ch: f.ch, k: f.tablet ? 6 : q === 1 ? 12 : 13 }
        }
        if (front) {
          clear(cx, cy)
          put(cx, cy, front.ch, front.k)
        } else if (back) {
          clear(cx, cy)
          put(cx, cy, back.ch, 10)
        }
      }
    }
  })
  // The climber rests under gate 1, given its light.
  put(c1, b1 + 1, '人', 9)
  return { cells, covered }
}
