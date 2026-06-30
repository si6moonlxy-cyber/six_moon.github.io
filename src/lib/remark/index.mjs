import { contentContext } from './urls.mjs';
import { transformText } from './wiki-link.mjs';
import { normalizeImageSoftBreaks, normalizeTextSoftBreaks } from './soft-break.mjs';
import { normalizeMarkdownImage } from './markdown-image.mjs';

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
    } else if (child.type === 'image') {
      normalizeMarkdownImage(child);
    } else if (!['link', 'inlineCode', 'code'].includes(child.type)) {
      transformChildren(child, context);
    }
  }

  normalizeImageSoftBreaks(node);
  normalizeTextSoftBreaks(node);
}

export function remarkObsidian() {
  return function transformer(tree, file) {
    transformChildren(tree, contentContext(file));
    normalizeMarkdownImage(tree);
  };
}
