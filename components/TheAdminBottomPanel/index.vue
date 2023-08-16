<template>
<div class="adminBottomPanel">
  <NuxtIcon name="doc" style="color: black; font-size: 24px" />
  <NuxtIcon name="plus" style="color: black; font-size: 24px" />
  <NuxtIcon name="user" filled style="color: black; font-size: 26px" />
  <NuxtIcon name="logout" filled style="color: black; font-size: 24px" />
</div>
</template>
<script>
export default {

};
</script>
<style scoped lang="scss">
.adminBottomPanel {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
  border-top: 1px solid #000;
}
</style>
