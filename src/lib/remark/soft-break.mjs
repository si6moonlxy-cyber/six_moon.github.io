import { isImageNode, hasLineEnding } from './utils.mjs';

export function normalizeImageSoftBreaks(node) {
  if (node?.type !== 'paragraph' || !Array.isArray(node.children)) {
    return;
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (child.type !== 'text' || !hasLineEnding(child.value)) {
      continue;
    }

    const previous = node.children[index - 1];
    const next = node.children[index + 1];
    const betweenImages = isImageNode(previous) && isImageNode(next);

    if (/^[\t \r\n]+$/.test(child.value) && betweenImages) {
      node.children.splice(index, 1);
      index -= 1;
      continue;
    }

    const replacement = [];
    const leadingBreak = isImageNode(previous) && /^[\t ]*\r?\n/.test(child.value);
    const trailingBreak = isImageNode(next) && /\r?\n[\t ]*$/.test(child.value);
    let value = child.value;

    if (leadingBreak) {
      value = value.replace(/^[\t ]*\r?\n[\t ]*/, '');
      replacement.push({ type: 'break' });
    }

    if (trailingBreak) {
      value = value.replace(/[\t ]*\r?\n[\t ]*$/, '');
    }

    if (value) {
      replacement.push({ type: 'text', value });
    }

    if (trailingBreak) {
      replacement.push({ type: 'break' });
    }

    if (replacement.length > 0) {
      node.children.splice(index, 1, ...replacement);
      index += replacement.length - 1;
    }
  }
}

export function normalizeTextSoftBreaks(node) {
  if (node?.type !== 'paragraph' || !Array.isArray(node.children)) {
    return;
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (child.type !== 'text' || !hasLineEnding(child.value)) {
      continue;
    }

    const parts = child.value.split(/\r?\n/);
    const replacement = [];

    parts.forEach((part, partIndex) => {
      if (part) {
        replacement.push({ type: 'text', value: part });
      }

      if (partIndex < parts.length - 1) {
        replacement.push({ type: 'break' });
      }
    });

    if (replacement.length > 0) {
      node.children.splice(index, 1, ...replacement);
      index += replacement.length - 1;
    }
  }
}
