<template>
  <div class="skeleton-card">
    <div class="skeleton-container">
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-header">
          <div class="skeleton-title"></div>
          <div class="skeleton-price"></div>
          <div class="skeleton-description">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
        <div class="skeleton-options">
          <div class="skeleton-option">
            <div class="skeleton-option-title"></div>
            <div class="skeleton-colors">
              <div class="skeleton-color"></div>
              <div class="skeleton-color"></div>
              <div class="skeleton-color"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="skeleton-button"></div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.skeleton-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 330px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.skeleton-image {
  width: 250px;
  height: 250px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 20px;
  margin: 15px;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.skeleton-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title {
  height: 24px;
  width: 80%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-price {
  height: 20px;
  width: 40%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-description {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.skeleton-line {
  height: 14px;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  &.short {
    width: 60%;
  }
}

.skeleton-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skeleton-option {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-option-title {
  height: 18px;
  width: 50px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-colors {
  display: flex;
  gap: 15px;
  margin-left: 5px;
}

.skeleton-color {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-button {
  width: calc(100% - 40px);
  height: 45px;
  margin: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
