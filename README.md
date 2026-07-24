<div align="center" margin="0 auto 20px">
  <h1>svelte-copyright</h1>
  <p style="font-style: italic;">© A Svelte component to format and display a copyright notice.</p>
  <div>
    <a href='https://github.com/himynameisdave/svelte-copyright/actions?query=workflow%3Atest+branch%3Amain'>
      <img src="https://github.com/himynameisdave/svelte-copyright/workflows/test/badge.svg" alt="GitHub Actions - Test Workflow Badge" />
    </a>
    <a href="https://packagephobia.now.sh/result?p=svelte-copyright">
        <img src="https://packagephobia.now.sh/badge?p=svelte-copyright" alt="Install size" />
    </a>
    <a href="https://bundlephobia.com/result?p=svelte-copyright">
        <img src="https://img.shields.io/bundlephobia/min/svelte-copyright.svg" alt="Bundle size (minified)" />
    </a>
  </div>
</div>

---

A [Svelte](https://svelte.dev/) component to format and display a copyright notice.

Requires **Svelte 5**. For Svelte 4, use `svelte-copyright@2`.

### Installation

This package is available on NPM. Install it with whichever package manager you use:

```
npm install -D svelte-copyright

yarn add -D svelte-copyright

pnpm add -D svelte-copyright

bun add -d svelte-copyright
```

Note that it only needs to be installed as a devDependency, like `svelte` itself.

### Usage

Import the `Copyright` component and use it in your Svelte project.

```svelte
<script>
  import Copyright from 'svelte-copyright';
</script>

<footer>
  <Copyright>
    Dave Lunny
  </Copyright>
</footer>
```

This will output HTML which looks something like this:

```html
<footer>
  <span>© Copyright 2023 Dave Lunny</span>
</footer>
```

#### Props

All props are optional (as they all have default values).

**Prop** | **Possible Values** | **Default Value** | **Description**
---|---|---|---
`date` | `Date` | `new Date()` | Date for the copyright year.
`format` | `'numeric'` \| `'2-digit'` | `'numeric'` | Format for the copyright year.
`position` | `'pre'` \| `'post'`  | `'pre'` | Position of the Copyright relative to the contents you provide.
`showRange` | `true` \| `false`  | `false` | If true, displays a range from the `date` prop to the current year (ie: '2010 - 2020').

All props are reactive. Updating any of them re-renders the notice.

**Additional Props**

Note that any additonal props will be spread onto the component. This allows you to do things like provide a custom `class` name to your component.

```svelte
<Copyright class="custom-copyright">
  Dave Lunny
</Copyright>

<style>
  :global(.custom-copyright) {
    color: lime;
  }
</style>
```

#### TypeScript

Types ship with the package. The props type is exported if you need it, along with the `FORMAT` and `POSITION` constants:

```svelte
<script lang="ts">
  import Copyright, { FORMAT, type CopyrightProps } from 'svelte-copyright';

  const props: CopyrightProps = {
    format: FORMAT.TWO_DIGIT,
    showRange: true,
  };
</script>

<Copyright {...props}>
  Dave Lunny
</Copyright>
```

### Migrating from v2

v3 requires Svelte 5. The props are unchanged, so most usage needs no edits.

- Content is now a [snippet](https://svelte.dev/docs/svelte/snippet) rather than a slot. Passing children the normal way (`<Copyright>Dave Lunny</Copyright>`) works exactly as before.
- The displayed date is now `$derived`. Previously it was computed once when the component initialised, so changing `date` after mount did nothing. Now it updates.

### Contributing

Feel free to [file an issue](https://github.com/himynameisdave/svelte-copyright/issues/new) or open a pull request. Ensure that you add tests for any new functionality.

#### Development

This repo uses [Bun](https://bun.com/) for package management. Installing it is the only prerequisite. Everything else comes from `bun install`.

```
bun install         # install dependencies
bun run dev         # run the demo app at localhost:5173
bun run test        # playwright + vitest
bun run test:unit   # just the unit/component tests
bun run lint        # eslint
bun run check       # svelte-check
bun run package     # build dist/ and validate it with publint

bun run verify:consumer       # check an npm consumer can install the tarball
bun run verify:consumer pnpm  # ...or yarn, pnpm, bun
```

Bun is a development detail only. The package is published to NPM as a normal tarball, and consumers can install it with any package manager.

`verify:consumer` is what keeps that honest. It packs the tarball with `npm pack`, installs it into a throwaway Svelte app using the package manager you name, and bundles that app, so a broken `exports` map or a file missing from `files` fails loudly instead of reaching the registry. CI runs it for `npm`, `yarn` and `pnpm` on every push.

### Inspiration

This was inspired by [`react-copyright`](https://github.com/jasonbellamy/react-copyright) by [Jason Bellamy](https://github.com/jasonbellamy).

---

_✌️ Built by [Dave Lunny](http://himynameisdave.com)._
