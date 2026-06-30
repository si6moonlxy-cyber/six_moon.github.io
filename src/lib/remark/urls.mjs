import path from 'node:path';
import { encodePath, slugSegment } from './utils.mjs';

export const OBSIDIAN_TOKEN = /(!)?\[\[([^\]\n]+)\]\]/g;

export const IMAGE_CATEGORY_BY_CONTENT_DIR = {
  blog: 'blog',
  posts: 'blog',
  template: 'template',
  craft: 'craft',
};

export function contentContext(file) {
  const filePath = file?.path;

  if (!filePath) {
    return { category: 'blog', relativeDir: '' };
  }

  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/\/src\/content\/([^/]+)\/(.+)$/);

  if (!match) {
    return { category: 'blog', relativeDir: '' };
  }

  const [, contentDir, relativePath] = match;
  const relativeDir = path.dirname(relativePath).replace(/\\/g, '/');

  return {
    category: IMAGE_CATEGORY_BY_CONTENT_DIR[contentDir] ?? contentDir,
    relativeDir: relativeDir === '.' ? '' : relativeDir,
  };
}

export function resolveRelativeTarget(target, currentDir) {
  if (!currentDir || target.includes('/') || target.includes('\\')) {
    return target;
  }

  return `${currentDir}/${target}`;
}

export function wikiUrl(target, context) {
  if (/^(https?:)?\/\//.test(target) || target.startsWith('/')) {
    return target;
  }

  const [rawPagePath, heading] = resolveRelativeTarget(target, context.relativeDir)
    .replace(/\\/g, '/')
    .split('#');
  const pagePath = rawPagePath.replace(/\.(md|mdx)$/i, '');
  const pathSegments = pagePath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(slugSegment(segment)))
    .join('/');
  const hash = heading ? `#${encodeURIComponent(slugSegment(heading))}` : '';

  return `/blog/${pathSegments}/${hash}`;
}

export function imageUrl(target, context) {
  if (/^(https?:)?\/\//.test(target) || target.startsWith('/')) {
    return target;
  }

  return `/images/${context.category}/${encodePath(target)}`;
}
