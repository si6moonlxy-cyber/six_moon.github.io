import { mergeStyle } from './utils.mjs';

const OBSIDIAN_IMAGE_SIZE = /^(\d{1,4})(?:x(\d{1,4}))?$/i;

export function imageSize(label) {
  const match = label?.trim().match(OBSIDIAN_IMAGE_SIZE);

  if (!match) {
    return null;
  }

  return {
    width: Number(match[1]),
    height: match[2] ? Number(match[2]) : undefined,
  };
}

export function applyImageSize(node, size) {
  if (!size?.width) {
    return;
  }

  const hProperties = node.data?.hProperties ?? {};

  node.data = {
    ...node.data,
    hProperties: {
      ...hProperties,
      width: size.width,
      'data-obsidian-width': String(size.width),
      style: mergeStyle(hProperties.style, `--obsidian-image-width: ${size.width}px;`),
    },
  };
}
