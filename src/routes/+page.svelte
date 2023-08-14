<script lang="ts">
  import Copyright from '../lib/Copyright.svelte';
</script>

<h1>
  Svelte Copyright
</h1>

<style lang="less">
  .example {
    background-color: #f4f4f4;
    border-radius: 0.25rem;
    padding: 1rem;
  }
</style>

<p>
  Displays a basic copyright notice with the current year.
</p>

<div class="example">
  <Copyright />
</div>

<p>
  You can include any child content you want...
</p>

<div class="example">
  <Copyright>
    Mindless Corp.
  </Copyright>
</div>

<p>
  ...which can be positioned before or after the copyright.
</p>

<div class="example">
  <Copyright position="post">
    Mindless Corp.
  </Copyright>
</div>

<p>
  You can pin a specific year if desired...
</p>

<div class="example">
  <Copyright date={new Date('1991-09-10')}>
    Mindless Corp.
  </Copyright>
</div>

<p>
  but date ranges are also supported (from the specified date until the current year).
</p>

<div class="example">
  <Copyright
    date={new Date('1991-09-10')}
    showRange
  >
    Mindless Corp.
  </Copyright>
</div>

<p>
  You can use 2-digit year format instead.
</p>

<div class="example">
  <Copyright
    date={new Date('1991-08-10')}
    format="2-digit"
    show
  >
    Mindless Corp.
  </Copyright>
</div>
