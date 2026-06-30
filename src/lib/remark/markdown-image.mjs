import { splitTarget, baseName } from './utils.mjs';
import { imageSize, applyImageSize } from './image-size.mjs';

export function normalizeMarkdownImage(node) {
  if (node.type !== 'image' || !node.alt?.includes('|')) {
    return;
  }

  const { target, label } = splitTarget(node.alt);
  const size = imageSize(label);

  if (!size) {
    return;
  }

  node.alt = baseName(target);
  applyImageSize(node, size);
}
