/**
 * Pure utility functions — no dependencies on other remark modules.
 */

export function splitTarget(rawValue) {
  const pipeIndex = rawValue.indexOf('|');

  if (pipeIndex === -1) {
    return { target: rawValue.trim(), label: '' };
  }

  return {
    target: rawValue.slice(0, pipeIndex).trim(),
    label: rawValue.slice(pipeIndex + 1).trim(),
  };
}

export function baseName(value) {
  const name = value.replace(/\\/g, '/').split('/').pop() ?? value;
  return name.replace(/\.(png|jpe?g|gif|webp|avif|svg|bmp|mdx?)$/i, '');
}

export function slugSegment(value) {
  return value
    .trim()
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-龥_-]+/g, '');
}

export function encodePath(path) {
  return path
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export function isImageNode(node) {
  return node?.type === 'image';
}

export function hasLineEnding(value) {
  return /\r?\n/.test(value);
}

export function mergeStyle(existingStyle, nextStyle) {
  return [existingStyle, nextStyle].filter(Boolean).join(' ');
}
