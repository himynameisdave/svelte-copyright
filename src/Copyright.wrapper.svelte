<!--
  Wraps <Copyright /> so that we can assert on the rendered children,
  which is awkward to pass as a snippet straight from a test.
-->
<script lang="ts">
  import Copyright, { type CopyrightProps } from '$lib/Copyright.svelte';

  let props: CopyrightProps = $props();
</script>

<Copyright {...props}>
  Dave Lunny
</Copyright>
