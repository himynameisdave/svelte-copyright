<script>
  export let date = new Date();
  export let format = 'numeric';
  export let position = 'pre';
  
  function formatDate() {
    if (format === 'numeric') {
      return date.getFullYear().toString();
    }
    if (format === '2-digit') {
      return `’` + date.getFullYear().toString().slice(-2);
    }
  }

  let year = formatDate();
</script>

<span {...$$restProps}>
  {#if position === 'pre'}
    &#169; Copyright {year}
  {/if}
  <slot></slot>
  {#if position === 'post'}
    &#169; Copyright {year}
  {/if}
</span>
