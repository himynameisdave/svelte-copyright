<script>
  import { FORMAT, POSITION } from './constants';

  //  The date year to be displayed (default: today)
  export let date = new Date();
  //  Date format ('numeric' | '2-digit')
  export let format = FORMAT.NUMERIC;
  //  Position of the copyright + date message relative to component "children" slot.
  export let position = POSITION.PRE;
  
  function formatDate() {
    if (format === FORMAT.NUMERIC) {
      return date.getFullYear().toString();
    }
    if (format === FORMAT.TWO_DIGIT) {
      return `’` + date.getFullYear().toString().slice(-2);
    }
  }

  let year = formatDate();
</script>

<span {...$$restProps}>
  {#if position === POSITION.PRE}
    &#169; Copyright {year}
  {/if}
  <slot></slot>
  {#if position === POSITION.POST}
    &#169; Copyright {year}
  {/if}
</span>
