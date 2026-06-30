import { OBSIDIAN_TOKEN } from './urls.mjs';
import { splitTarget, baseName } from './utils.mjs';
import { imageSize, applyImageSize } from './image-size.mjs';
import { wikiUrl, imageUrl } from './urls.mjs';

function imageAlt(target, label) {
  if (!label || /^\d+(x\d+)?$/i.test(label)) {
    return baseName(target);
  }

  return label;
}

export function transformText(value, context) {
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
      const imageNode = {
        type: 'image',
        url: imageUrl(target, context),
        alt: imageAlt(target, label),
      };

      applyImageSize(imageNode, imageSize(label));
      nodes.push(imageNode);
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
