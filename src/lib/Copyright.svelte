<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Format, Position } from './types.js';

  export type CopyrightProps = HTMLAttributes<HTMLSpanElement> & {
    //  The date year to be displayed (default: today)
    date?: Date;
    //  Date format ('numeric' | '2-digit')
    format?: Format;
    //  Position of the copyright + date message relative to the component's children.
    position?: Position;
    //  If a date range should be shown. If this is the case, the date of the initial year should be provided.
    showRange?: boolean;
    //  The content displayed alongside the copyright notice.
    children?: Snippet;
  };
</script>

<script lang="ts">
  import { FORMAT, POSITION } from './constants.js';
  import { getDisplayDate, today } from './utils/index.js';

  let {
    date = today(),
    format = FORMAT.NUMERIC,
    position = POSITION.PRE,
    showRange = false,
    children,
    ...rest
  }: CopyrightProps = $props();

  //  Derived so that the notice updates if any of the props change.
  const displayDate = $derived(getDisplayDate({
    showRange,
    format,
    date,
  }));
</script>

<span {...rest}>
  {#if position === POSITION.PRE}
    &#169; Copyright {displayDate}
  {/if}
  {@render children?.()}
  {#if position === POSITION.POST}
    &#169; Copyright {displayDate}
  {/if}
</span>
