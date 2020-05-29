<!-- 
  This component is required to test slots, which is not supported by Svelte yet
  https://github.com/testing-library/svelte-testing-library/issues/48
-->
<script>
  import Copyright from '../Copyright';
</script>

<Copyright {...$$props}>
  Dave Lunny
</Copyright>
