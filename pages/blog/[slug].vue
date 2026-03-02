<!-- eslint-disable max-len -->
<template>
  <div class="post-page">
    <template v-if="post">
      <div class="post-hero">
        <div class="post-hero__image">
          <img v-if="post.image" :src="post.image" :alt="post.title" />
          <div v-else class="post-hero__image-placeholder">
            <span class="material-symbols-rounded">article</span>
          </div>
        </div>
        <div class="post-hero__overlay">
          <div class="post-hero__content">
            <span class="post-hero__category">{{ post.category }}</span>
            <h1 class="post-hero__title">{{ post.title }}</h1>
            <div class="post-hero__meta">
              <span class="post-hero__date">{{ formatDate(post.date) }}</span>
              <span class="post-hero__dot">·</span>
              <span class="post-hero__read-time">
                <span class="material-symbols-rounded">schedule</span>
                {{ post.readTime }} мин чтения
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="post-layout">
        <NuxtLink to="/blog" class="post-back">
          <span class="material-symbols-rounded">arrow_back</span>
          Все статьи
        </NuxtLink>

        <article class="post-body">
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="post-content" v-html="post.content" />

          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
          </div>
        </article>

        <div v-if="relatedPosts.length" class="post-related">
          <h2 class="post-related__title">Читайте также</h2>
          <div class="post-related__grid">
            <BlogCard v-for="related in relatedPosts" :key="related.id" :post="related" />
          </div>
        </div>
      </div>
    </template>

    <div v-else class="post-not-found">
      <span class="material-symbols-rounded">search_off</span>
      <p>Статья не найдена</p>
      <NuxtLink to="/blog" class="post-not-found__link">Вернуться в блог</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useBlog } from '~/stores/blog';

const route = useRoute();
const blog = useBlog();

const post = computed(() => blog.getPostBySlug(route.params.slug));

const relatedPosts = computed(() => {
  if (!post.value) return [];
  return blog.posts
    .filter((p) => p.id !== post.value.id && p.categorySlug === post.value.categorySlug)
    .slice(0, 3);
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

const pageUrl = computed(() => `https://рк-тек.рф/blog/${route.params.slug}`);

useHead(() => ({
  title: post.value ? `${post.value.title} — РК Тек` : 'Статья не найдена — РК Тек',
  link: [{ rel: 'canonical', href: pageUrl.value }],
  meta: post.value
    ? [
        { name: 'description', content: post.value.excerpt },
        { property: 'og:title', content: post.value.title },
        { property: 'og:description', content: post.value.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: pageUrl.value },
        { property: 'article:published_time', content: post.value.date },
      ]
    : [],
  script: post.value
    ? [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.value.title,
            description: post.value.excerpt,
            datePublished: post.value.date,
            url: pageUrl.value,
            publisher: {
              '@type': 'Organization',
              name: 'РК Тек',
              url: 'https://рк-тек.рф',
            },
          }),
        },
      ]
    : [],
}));
</script>

<style scoped lang="scss">
.post-page {
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.post-hero {
  position: relative;
  width: 100%;
  height: 460px;
  overflow: hidden;
  margin-top: 70px;

  @media (max-width: 850px) {
    height: 320px;
    margin-top: 60px;
  }

  @media (max-width: 600px) {
    height: 260px;
  }
}

.post-hero__image {
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.post-hero__image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1c1c1e 0%, #3a3a3c 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-rounded {
    font-size: 80px;
    color: rgba(255, 255, 255, 0.15);
    font-variation-settings: 'FILL' 1;
  }
}

.post-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%);
  display: flex;
  align-items: flex-end;
}

.post-hero__content {
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;

  @media (max-width: 850px) {
    padding: 28px 20px;
  }
}

.post-hero__category {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  width: fit-content;
}

.post-hero__title {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  line-height: 1.25;
  max-width: 700px;

  @media (max-width: 850px) {
    font-size: 24px;
  }
}

.post-hero__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.8;
}

.post-hero__read-time {
  display: flex;
  align-items: center;
  gap: 4px;

  .material-symbols-rounded {
    font-size: 14px;
  }
}

.post-hero__dot {
  opacity: 0.5;
}

.post-layout {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 40px 80px;
  max-width: 800px;

  @media (max-width: 1100px) {
    max-width: 100%;
  }

  @media (max-width: 850px) {
    margin: 28px 20px;
    gap: 28px;
  }
}

.post-back {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b6b6b;
  text-decoration: none;
  width: fit-content;
  transition: color 0.2s, gap 0.2s;

  &:hover {
    color: #1a1a1a;
    gap: 2px;
  }

  .material-symbols-rounded {
    font-size: 18px;
  }
}

.post-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-excerpt {
  font-size: 18px;
  font-weight: 500;
  color: #3a3a3c;
  line-height: 1.7;
  margin: 0;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 850px) {
    font-size: 16px;
  }
}

.post-content {
  font-size: 16px;
  color: #1a1a1a;
  line-height: 1.8;

  :deep(h2) {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 32px 0 12px;

    &:first-child {
      margin-top: 0;
    }

    @media (max-width: 850px) {
      font-size: 20px;
    }
  }

  :deep(p) {
    margin: 0 0 16px;
    color: #3a3a3c;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(strong) {
    font-weight: 600;
    color: #1a1a1a;
  }

  :deep(ul), :deep(ol) {
    padding-left: 24px;
    margin: 0 0 16px;

    li {
      margin-bottom: 8px;
      color: #3a3a3c;
    }
  }
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.post-tag {
  padding: 5px 14px;
  border-radius: 20px;
  background: #f5f5f7;
  font-size: 13px;
  color: #6b6b6b;
  font-weight: 500;
}

.post-related {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
}

.post-related__title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.post-related__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.post-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 60vh;
  color: #aeaeb2;
  margin-top: 70px;

  .material-symbols-rounded {
    font-size: 64px;
    font-variation-settings: 'FILL' 1;
  }

  p {
    font-size: 18px;
    margin: 0;
    color: #6b6b6b;
  }
}

.post-not-found__link {
  font-size: 15px;
  font-weight: 500;
  color: #0071e3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
