import { defineStore } from 'pinia';
import { blogPosts, blogCategories } from '~/data/blogPosts';

export const useBlog = defineStore('blog', {
  state: () => ({
    posts: blogPosts,
    categories: blogCategories,
  }),

  getters: {
    getPostBySlug: (state) => (slug) => state.posts.find((p) => p.slug === slug),
    getPostsByCategory: (state) => (categorySlug) => {
      if (!categorySlug || categorySlug === 'all') return state.posts;
      return state.posts.filter((p) => p.categorySlug === categorySlug);
    },
    latestPosts: (state) => [...state.posts].slice(0, 3),
  },
});
