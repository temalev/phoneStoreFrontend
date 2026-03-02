<template>
  <NuxtLink :to="`/blog/${post.slug}`" class="blog-card">
    <div class="blog-card__image">
      <img v-if="post.image" :src="post.image" :alt="post.title" loading="lazy" />
      <div v-else class="blog-card__image-placeholder">
        <span class="material-symbols-rounded">article</span>
      </div>
      <span class="blog-card__category">{{ post.category }}</span>
    </div>
    <div class="blog-card__body">
      <h3 class="blog-card__title">{{ post.title }}</h3>
      <p class="blog-card__excerpt">{{ post.excerpt }}</p>
      <div class="blog-card__meta">
        <span class="blog-card__date">{{ formatDate(post.date) }}</span>
        <span class="blog-card__read-time">
          <span class="material-symbols-rounded">schedule</span>
          {{ post.readTime }} мин
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};
</script>

<style scoped lang="scss">
.blog-card {
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eee;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.25s, transform 0.25s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);

    .blog-card__title {
      color: #0071e3;
    }
  }
}

.blog-card__image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #f5f5f7;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.blog-card__image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0f5 0%, #e5e5ea 100%);

  .material-symbols-rounded {
    font-size: 48px;
    color: #c7c7cc;
    font-variation-settings: 'FILL' 1;
  }
}

.blog-card__category {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.01em;
}

.blog-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  flex: 1;
}

.blog-card__title {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__excerpt {
  font-size: 14px;
  color: #6b6b6b;
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.blog-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.blog-card__date {
  font-size: 12px;
  color: #aeaeb2;
}

.blog-card__read-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #aeaeb2;

  .material-symbols-rounded {
    font-size: 14px;
  }
}
</style>
