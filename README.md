# Stipple

A theme mod for Claude Code and the Claude desktop app.

- A paper-and-ink palette for light and dark mode. Dark mode uses grey-green surfaces and grey text, so long reading stays easy.
- A living backdrop drawn from characters. Cedars of 木 and 山 stand in the margins, and a vermilion torii gate stands at the top right.
- Leaves fall, fireflies drift, and wind moves through the needles.
- The pointer carries a small lantern that shows hidden glyphs. A click sends a ripple through the forest. The gate glows when the pointer is near it.
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
- `tools/build.mjs` generates the glyph font, the torii, the tree table in `field.ts`, and all of `still.ts`.

## Change it

Edit `tools/build.mjs`, then run:

```
node tools/build.mjs
claude plugin validate .
```

## Known limits

- Where the app does not report the composer's position, the layout assumes a sidebar of about 12% of the window width or less. With a wider sidebar, the left cedars sit under it.
