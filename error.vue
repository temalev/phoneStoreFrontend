<!-- eslint-disable max-len -->
<template>
  <div class="error-page">
    <div class="error-page__content">
      <div class="error-page__code">{{ error.statusCode }}</div>
      <h1 class="error-page__title">
        {{ error.statusCode === 404 ? 'Страница не найдена' : 'Что-то пошло не так' }}
      </h1>
      <p class="error-page__desc">
        {{ error.statusCode === 404
          ? 'Возможно, страница была перемещена или удалена. Попробуйте вернуться на главную.'
          : 'Произошла ошибка на сервере. Попробуйте обновить страницу или вернуться позже.' }}
      </p>
      <div class="error-page__actions">
        <NuxtLink to="/" class="error-page__btn error-page__btn--primary" @click="clearError">
          На главную
        </NuxtLink>
        <NuxtLink to="/blog" class="error-page__btn error-page__btn--secondary" @click="clearError">
          Блог
        </NuxtLink>
      </div>
      <div class="error-page__links">
        <NuxtLink to="/iphone" @click="clearError">iPhone</NuxtLink>
        <NuxtLink to="/ipad" @click="clearError">iPad</NuxtLink>
        <NuxtLink to="/mac" @click="clearError">Mac</NuxtLink>
        <NuxtLink to="/airpods" @click="clearError">AirPods</NuxtLink>
        <NuxtLink to="/watch" @click="clearError">Apple Watch</NuxtLink>
        <NuxtLink to="/dyson" @click="clearError">Dyson</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const clearError = () => clearNuxtError();

useHead({
  title: '404 — Страница не найдена | РК Тек',
  meta: [
    { name: 'description', content: 'Страница не найдена. Вернитесь на главную страницу интернет-магазина РК Тек.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: #fff;
}

.error-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  max-width: 520px;
}

.error-page__code {
  font-size: 120px;
  font-weight: 700;
  color: #f0f0f0;
  line-height: 1;
  letter-spacing: -4px;

  @media (max-width: 600px) {
    font-size: 80px;
  }
}

.error-page__title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 22px;
  }
}

.error-page__desc {
  font-size: 16px;
  color: #6b6b6b;
  margin: 0;
  line-height: 1.6;
}

.error-page__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.error-page__btn {
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &--primary {
    background: #1a1a1a;
    color: #fff;
  }

  &--secondary {
    background: #f5f5f7;
    color: #1a1a1a;
  }
}

.error-page__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;

  a {
    font-size: 13px;
    color: #6b6b6b;
    text-decoration: none;
    padding: 4px 12px;
    border-radius: 20px;
    background: #f5f5f7;
    transition: background 0.2s;

    &:hover {
      background: #e8e8ed;
    }
  }
}
</style>
