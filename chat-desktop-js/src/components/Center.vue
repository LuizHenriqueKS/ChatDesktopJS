<template>
  <div class="center">
    <slot />
  </div>
</template>

<style scoped>
.center{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
}
</style>
