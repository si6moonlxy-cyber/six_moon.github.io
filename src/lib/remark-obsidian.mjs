import path from 'node:path';

const OBSIDIAN_TOKEN = /(!)?\[\[([^\]\n]+)\]\]/g;
const IMAGE_CATEGORY_BY_CONTENT_DIR = {
  blog: 'blog',
  posts: 'blog',
  template: 'template',
  craft: 'craft',
};

function splitTarget(rawValue) {
  const pipeIndex = rawValue.indexOf('|');

  if (pipeIndex === -1) {
    return {
      target: rawValue.trim(),
      label: '',
    };
  }

  return {
    target: rawValue.slice(0, pipeIndex).trim(),
    label: rawValue.slice(pipeIndex + 1).trim(),
  };
}

function encodePath(path) {
  return path
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function baseName(value) {
  const name = value.replace(/\\/g, '/').split('/').pop() ?? value;
  return name.replace(/\.(png|jpe?g|gif|webp|avif|svg|bmp|mdx?)$/i, '');
}

function slugSegment(value) {
  return value
    .trim()
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5_-]+/g, '');
}

function contentContext(file) {
  const filePath = file?.path;

  if (!filePath) {
    return {
      category: 'blog',
      relativeDir: '',
    };
  }

  const normalizedPath = filePath.replace(/\\/g, '/');
  const match = normalizedPath.match(/\/src\/content\/([^/]+)\/(.+)$/);

  if (!match) {
    return {
      category: 'blog',
      relativeDir: '',
    };
  }

  const [, contentDir, relativePath] = match;
  const relativeDir = path.dirname(relativePath).replace(/\\/g, '/');

  return {
    category: IMAGE_CATEGORY_BY_CONTENT_DIR[contentDir] ?? contentDir,
    relativeDir: relativeDir === '.' ? '' : relativeDir,
  };
}

function resolveRelativeTarget(target, currentDir) {
  if (!currentDir || target.includes('/') || target.includes('\\')) {
    return target;
  }

  return `${currentDir}/${target}`;
}

function wikiUrl(target, context) {
  if (/^(https?:)?\/\//.test(target) || target.startsWith('/')) {
    return target;
  }

  const [rawPagePath, heading] = resolveRelativeTarget(target, context.relativeDir).replace(/\\/g, '/').split('#');
  const pagePath = rawPagePath.replace(/\.(md|mdx)$/i, '');
  const path = pagePath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(slugSegment(segment)))
    .join('/');
  const hash = heading ? `#${encodeURIComponent(slugSegment(heading))}` : '';

  return `/blog/${path}/${hash}`;
}

function imageUrl(target, context) {
  if (/^(https?:)?\/\//.test(target) || target.startsWith('/')) {
    return target;
  }

  return `/images/${context.category}/${encodePath(target)}`;
}

function imageAlt(target, label) {
  if (!label || /^\d+(x\d+)?$/i.test(label)) {
    return baseName(target);
  }

  return label;
}

function transformText(value, context) {
  const nodes = [];
  let cursor = 0;
  let match;

  OBSIDIAN_TOKEN.lastIndex = 0;

  while ((match = OBSIDIAN_TOKEN.exec(value)) !== null) {
    const [token, embedMarker, rawValue] = match;

    if (match.index > cursor) {
      nodes.push({
        type: 'text',
        value: value.slice(cursor, match.index),
      });
    }

    const { target, label } = splitTarget(rawValue);

    if (!target) {
      nodes.push({ type: 'text', value: token });
    } else if (embedMarker) {
      nodes.push({
        type: 'image',
        url: imageUrl(target, context),
        alt: imageAlt(target, label),
      });
    } else {
      nodes.push({
        type: 'link',
        url: wikiUrl(target, context),
        children: [
          {
            type: 'text',
            value: label || baseName(target),
          },
        ],
      });
    }

    cursor = match.index + token.length;
  }

  if (cursor < value.length) {
    nodes.push({
      type: 'text',
      value: value.slice(cursor),
    });
  }

  return nodes.length > 1 || nodes[0]?.type !== 'text' ? nodes : null;
}

function transformChildren(node, context) {
  if (!node || !Array.isArray(node.children)) {
    return;
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (child.type === 'text') {
      const replacement = transformText(child.value, context);

      if (replacement) {
        node.children.splice(index, 1, ...replacement);
        index += replacement.length - 1;
      }
    } else if (!['link', 'image', 'inlineCode', 'code'].includes(child.type)) {
      transformChildren(child, context);
    }
  }
}

export function remarkObsidian() {
  return function transformer(tree, file) {
    transformChildren(tree, contentContext(file));
  };
}
