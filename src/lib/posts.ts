import { getCollection, type CollectionEntry } from 'astro:content';
import { BLOG_TAGS, type BlogTag } from './tags';

export { BLOG_TAGS };

export type BlogPost = CollectionEntry<'blog'>;

export function getPostSlug(post: BlogPost) {
  return post.id.replace(/\.(md|mdx)$/, '');
}

export function getSourcePostSlug(post: BlogPost) {
  const filePath = (post as BlogPost & { filePath?: string }).filePath;
  const fileName = filePath?.replace(/\\/g, '/').split('/').pop();

  if (!fileName) {
    return getPostSlug(post);
  }

  return fileName.replace(/\.(md|mdx)$/i, '').toLowerCase().replace(/\s+/g, '-');
}

export function normalizePostSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5/_-]+/g, '');
}

export function getLegacyPostSlug(post: BlogPost) {
  return normalizePostSlug(getPostSlug(post));
}

export function getCompactPostSlug(post: BlogPost) {
  return normalizePostSlug(getPostSlug(post).replace(/[-_]+/g, ''));
}

export function getPostUrl(post: BlogPost) {
  return `/blog/${getLegacyPostSlug(post)}/`;
}

export function isBlogTag(tag: string): tag is BlogTag {
  return BLOG_TAGS.includes(tag as BlogTag);
}

export function postHasTag(post: BlogPost, tag: BlogTag) {
  return post.data.tags?.includes(tag) ?? false;
}

export async function getPublishedPosts() {
  const blogPosts = await getCollection('blog', ({ data }) => data.draft !== true);

  return blogPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
