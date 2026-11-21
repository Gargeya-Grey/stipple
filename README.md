# Stipple

A theme mod for Claude Code and the Claude desktop app.

- A paper-and-ink palette for light and dark mode. Dark mode uses grey-green surfaces and grey text, so long reading stays easy.
- A living backdrop drawn from characters. Cedars stand in the margins. In the right margin three flights of steps zigzag up through three vermilion torii, each smaller and farther than the last, to a point of light.
- A small figure, 人, climbs the steps one at a time. It rests at each gate, and each gate gives it more light. The first flight is worn stone, the second carries a dim light, and the third is lit gold.
- Leaves fall, fireflies drift, and wind moves through the needles.
- The pointer carries a small lantern that shows hidden glyphs. On the stairs it lights the step under it and the next few steps ahead. A click sends a ripple through the forest. The gate glows when the pointer is near it.
- The motion stays in the margins, away from the text of the conversation.

## Install

At the prompt of a terminal session:

```
/plugin install stipple --marketplace Gargeya-Grey/stipple
```

Answer `y` to add the marketplace, then pick a scope (user scope is first).

From a shell:

```
claude plugin install stipple --marketplace Gargeya-Grey/stipple
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `Gargeya-Grey/stipple`, then Add plugin.

A mod installed from a terminal at the user scope also loads in the desktop app's Code tab.

## Files

- `hooks/register.tsx` sets the colors and the backdrop at session start.
- `hooks/field.ts` is the shader that animates the backdrop.
- `hooks/still.ts` is the still picture shown where a shader cannot run. It is generated.
- `tools/art.mjs` holds the glyph font, the torii drawing and the climb: the flights and gates that `build.mjs` and `icon.mjs` both draw. `hooks/field.ts` draws the same climb with the same numbers, so change both together.
- `tools/build.mjs` generates the glyph tables and the tree table in `field.ts`, and all of `still.ts`.
- `tools/icon.mjs` draws the icon, the three-gate climb built from glyphs, as `tools/icon.svg`. `.claude-plugin/icon.png` is that SVG rendered at 1024 x 1024.

## Change it

Edit `tools/build.mjs`, then run:

```
node tools/build.mjs
claude plugin validate .
```

To redraw the icon, run `node tools/icon.mjs`, then render `tools/icon.svg` to `.claude-plugin/icon.png` at 1024 x 1024. For example, with headless Edge or Chrome:

```
msedge --headless=new --force-device-scale-factor=1 --window-size=1024,1024 --screenshot=.claude-plugin/icon.png tools/icon.svg
```

## Known limits

- Where the app does not report the composer's position, the layout assumes a sidebar of about 12% of the window width or less. With a wider sidebar, the left cedars sit under it.

## License

MIT, in [LICENSE](LICENSE). The license does not cover `hooks/make-colors.js` and `hooks/make-colors.d.ts`. Those two files come unchanged from the plugin-authoring skill of Claude Code, which tells mod authors to copy them in.
