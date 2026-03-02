<!-- eslint-disable max-len -->
<template>
  <div class="blog-page">
    <div class="blog-hero">
      <h1 class="blog-hero__title">Блог РК Тек</h1>
      <p class="blog-hero__subtitle">Советы по выбору техники, обзоры новинок и полезные инструкции</p>
    </div>

    <div class="blog-content">
      <div class="blog-filters">
        <button
          v-for="cat in blog.categories"
          :key="cat.slug"
          class="blog-filter"
          :class="{ 'blog-filter--active': activeCategory === cat.slug }"
          @click="activeCategory = cat.slug"
        >
          {{ cat.label }}
        </button>
      </div>

      <div v-if="filteredPosts.length" class="blog-grid">
        <BlogCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
      <div v-else class="blog-empty">
        <span class="material-symbols-rounded">article</span>
        <p>Статей в этой категории пока нет</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBlog } from '~/stores/blog';

const blog = useBlog();
const activeCategory = ref('all');

const filteredPosts = computed(() => blog.getPostsByCategory(activeCategory.value));

const blogOgImage = 'https://рк-тек.рф/images/mainPageBackground.webp';

useHead({
  title: 'Блог — РК Тек',
  link: [{ rel: 'canonical', href: 'https://рк-тек.рф/blog' }],
  meta: [
    { name: 'description', content: 'Блог РК Тек — советы по выбору iPhone, инструкции и интересные факты о технике Apple и Dyson. Статьи для покупателей из Рязани и Москвы.' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:title', content: 'Блог — РК Тек' },
    { property: 'og:description', content: 'Советы по выбору техники, обзоры новинок и полезные инструкции от РК Тек.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://рк-тек.рф/blog' },
    { property: 'og:image', content: blogOgImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: 'РК Тек' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Блог — РК Тек' },
    { name: 'twitter:description', content: 'Советы по выбору техники, обзоры новинок и полезные инструкции от РК Тек.' },
    { name: 'twitter:image', content: blogOgImage },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Blog',
            name: 'Блог РК Тек',
            description: 'Советы по выбору техники Apple и Dyson, инструкции и интересные факты.',
            url: 'https://рк-тек.рф/blog',
            publisher: { '@type': 'Organization', name: 'РК Тек', url: 'https://рк-тек.рф' }, // eslint-disable-line max-len
            blogPost: blog.posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: `https://рк-тек.рф/blog/${p.slug}`,
              datePublished: p.date,
              description: p.excerpt,
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://рк-тек.рф' }, // eslint-disable-line max-len
              { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://рк-тек.рф/blog' }, // eslint-disable-line max-len
            ],
          },
        ],
      }),
    },
  ],
});
</script>

<style scoped lang="scss">
.blog-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-bottom: 60px;
}

.blog-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  padding: 80px 24px 40px;
  background: linear-gradient(180deg, #f5f5f7 0%, #fff 100%);
  border-bottom: 1px solid #eee;
  margin-top: 70px;

  @media (max-width: 850px) {
    padding: 60px 20px 32px;
    margin-top: 60px;
  }
}

.blog-hero__title {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 850px) {
    font-size: 32px;
  }
}

.blog-hero__subtitle {
  font-size: 18px;
  color: #6b6b6b;
  margin: 0;
  max-width: 540px;
  line-height: 1.5;

  @media (max-width: 850px) {
    font-size: 15px;
  }
}

.blog-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin: 0 80px;

  @media (max-width: 850px) {
    margin: 0 16px;
  }
}

.blog-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.blog-filter {
  padding: 8px 18px;
  border-radius: 20px;
  border: 1.5px solid #e0e0e0;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #6b6b6b;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
  }

  &--active {
    background: #1a1a1a;
    border-color: #1a1a1a;
    color: #fff;

    &:hover {
      background: #333;
      border-color: #333;
    }
  }
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.blog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 24px;
  color: #aeaeb2;

  .material-symbols-rounded {
    font-size: 48px;
    font-variation-settings: 'FILL' 1;
  }

  p {
    font-size: 16px;
    margin: 0;
  }
}
</style>
