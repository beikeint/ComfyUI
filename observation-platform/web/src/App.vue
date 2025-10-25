<template>
  <div class="min-h-screen w-full bg-[#030712] text-white">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
html,
body,
#app {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(6, 22, 48, 1) 0%, rgba(7, 14, 34, 1) 100%);
}
</style>
