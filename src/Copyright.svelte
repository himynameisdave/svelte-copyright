<script>
  import { FORMAT, POSITION } from './constants';
  import { withFormatGetDate, withGetDateRange } from './utils';

  //  The date year to be displayed (default: today)
  export let date = new Date();
  //  Date format ('numeric' | '2-digit')
  export let format = FORMAT.NUMERIC;
  //  Position of the copyright + date message relative to component "children" slot.
  export let position = POSITION.PRE;
  //  If a date range should be shown. If this is the case, the date of the initial year should be provided.
  export let showRange = false;
  
  //  Get the formatDate function
  const formatDate = withFormatGetDate(format);
  const getDateRange = withGetDateRange(showRange);
  
  let displayDate = getDateRange(date, formatDate);
</script>

<span {...$$restProps}>
  {#if position === POSITION.PRE}
    &#169; Copyright {displayDate}
  {/if}
  <slot></slot>
  {#if position === POSITION.POST}
    &#169; Copyright {displayDate}
  {/if}
</span>
