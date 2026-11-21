import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { STILL_SVG } from './still'

const SCENE = 'stipple'

// House tokens. Dark mode is softened on purpose: a grey-green ground and grey text, about 10:1, not 16:1.
const { theme, problems } = makeColors({
  label: 'Stipple',
  roles: { accent: '#1E5B49', danger: '#B4472F', success: '#0B7A55', warning: '#9A6B12', pro: '#56679C' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#F6F7F4',
        'surface-1': '#FBFCFA',
        'surface-2': '#FFFFFF',
        'text-primary': '#14201C',
        'text-secondary': '#33403B',
        'text-muted': '#53615B',
      },
    },
    git: { added: '#0B7A55', removed: '#B4472F' },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1A201E',
        'surface-1': '#1F2624',
        'surface-2': '#242B29',
        'surface-3': '#262E2B',
        'text-primary': '#CDD3CF',
        'text-secondary': '#ADB5B1',
        'text-muted': '#959E99',
      },
    },
    roles: { accent: '#56C495', danger: '#DB8A72', success: '#56C495', warning: '#C9A25A', pro: '#93A2CF' },
    git: { added: '#56C495', removed: '#DB8A72' },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: SCENE, glass: { blur: 14 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    if (e.props.scene !== SCENE) {
      return next(e)
    }

    const { Shader, Svg } = $.ui.resolve(e)
    const still = <Svg source={STILL_SVG} alt="A forest built of characters, with a vermilion torii gate" isInteractive />

    if (Shader === undefined) {
      return still
    }

    return <Shader module="./field.ts">{still}</Shader>
  })
}
