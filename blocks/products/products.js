const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

/**
 * Draws the "one system" diagram: one node per product, each joined to the others.
 * Works for two to four products.
 */
function buildDiagram(nodes, caption) {
  const w = 440;
  const h = 340;
  const positions = {
    2: [[110, 170], [330, 170]],
    3: [[220, 78], [96, 248], [344, 248]],
    4: [[110, 90], [330, 90], [110, 250], [330, 250]],
  }[nodes.length];
  if (!positions) return null;

  const names = nodes.map((n) => n.short).join(', ');
  const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': `${names} as one connected system` });

  const lines = svgEl('g', { stroke: '#1C6CA6', 'stroke-width': '2.5', 'stroke-linecap': 'round' });
  positions.forEach(([x1, y1], i) => {
    positions.slice(i + 1).forEach(([x2, y2]) => {
      lines.append(svgEl('line', {
        x1, y1, x2, y2,
      }));
    });
  });
  svg.append(lines);

  positions.forEach(([x, y], i) => {
    svg.append(svgEl('circle', {
      cx: x, cy: y, r: 44, fill: '#FFFFFF', stroke: '#1C6CA6', 'stroke-width': '2.5',
    }));
    if (nodes[i].icon) {
      svg.append(svgEl('image', {
        href: nodes[i].icon, x: x - 18, y: y - 18, width: 36, height: 36,
      }));
    }
    const label = svgEl('text', {
      x,
      y: y < h / 2 ? y - 56 : y + 70,
      'text-anchor': 'middle',
      fill: '#0B2238',
      'font-size': '17',
      'font-weight': '700',
    });
    label.textContent = nodes[i].short;
    svg.append(label);
  });

  if (caption) {
    const c = svgEl('text', {
      x: w / 2, y: nodes.length === 3 ? 196 : h / 2 + 5, 'text-anchor': 'middle', fill: '#3A4450', 'font-size': '14',
    });
    c.textContent = caption;
    svg.append(c);
  }
  return svg;
}

/**
 * Products: one row per product. | :icon: | **Product name** + description |
 * An optional one-cell row sets the diagram caption (default "One system").
 * @param {Element} block The products block element
 */
export default function decorate(block) {
  let caption = 'One system';
  const list = document.createElement('ul');
  list.className = 'products-list';
  const nodes = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      caption = cells[0].textContent.trim() || caption;
      return;
    }
    const [iconCell, textCell] = cells;
    const li = document.createElement('li');
    const icon = iconCell?.querySelector('.icon');
    if (icon) li.append(icon);
    const text = document.createElement('div');
    if (textCell) text.append(...textCell.childNodes);
    li.append(text);
    list.append(li);

    const name = text.querySelector('strong')?.textContent.trim() || '';
    nodes.push({
      short: name.replace(/^Altura Shield\s+/i, '') || name,
      icon: icon?.querySelector('img')?.getAttribute('src') || '',
    });
  });

  const media = document.createElement('div');
  media.className = 'products-diagram';
  const diagram = buildDiagram(nodes, caption);
  if (diagram) media.append(diagram);

  block.replaceChildren(list, media);
}
