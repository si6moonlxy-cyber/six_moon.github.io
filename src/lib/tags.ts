export const BLOG_TAGS = ['生活', '博客', '项目', '想法'] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export const TAG_SLUGS: Record<BlogTag, string> = {
  生活: 'life',
  博客: 'blog',
  项目: 'project',
  想法: 'idea',
};

export function getTagUrl(tag: BlogTag) {
  return `/tags/${TAG_SLUGS[tag]}/`;
}

export function getTagBySlug(slug: string) {
  return BLOG_TAGS.find((tag) => TAG_SLUGS[tag] === slug || tag === slug);
}
