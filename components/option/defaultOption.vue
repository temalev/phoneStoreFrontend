<template>
  <div class="mainColorOption">
    <h3>Память</h3>
    <div class="colorContainer">
      <div class="color">
        <label class="labelColor" for="i" />
        <input id="i" class="inputColor" type="radio" />
      </div>
    </div>
  </div>
</template>
<script></script>
<style scoped>
.inputColor {
  appearance: none;
  position: absolute;
}

.labelColor {
  width: 40px;
  height: 40px;
  display: block;
}

.labelColor:before {
  content: '';
  position: relative;
  background-color: rgb(155, 155, 155);
  border: 1px solid transparent;
  width: 40px;
  height: 40px;
  display: block;
  border-radius: 50%;
}

.inputColor:checked + .labelColor:before {
  content: '';
  position: relative;
  background-color: rgb(255, 255, 255);
  border: 1px solid black;
  width: 40px;
  height: 40px;
  display: block;
  border-radius: 50%;
}
</style>
