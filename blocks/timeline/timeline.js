/**
 * Timeline: one row per moment. | time | heading and text | optional anchor id |
 * A row whose time cell reads "Outcome" is marked done, and a last paragraph
 * that reads "Resolved" becomes the green status line.
 * @param {Element} block The timeline block element
 */
export default function decorate(block) {
  const list = document.createElement('ol');
  list.className = 'timeline-list';

  [...block.children].forEach((row) => {
    const [time, body, anchor] = row.children;
    const li = document.createElement('li');

    const t = document.createElement('span');
    t.className = 'timeline-time';
    t.textContent = time?.textContent.trim() || '';
    li.append(t);

    const content = document.createElement('div');
    content.className = 'timeline-body';
    if (body) content.append(...body.childNodes);
    li.append(content);

    if (/^outcome$/i.test(t.textContent)) li.classList.add('done');

    const last = content.querySelector(':scope > p:last-child');
    if (last && /^resolved$/i.test(last.textContent.trim())) {
      last.className = 'timeline-state';
      const icon = document.createElement('span');
      icon.className = 'icon icon-circle-check';
      const img = document.createElement('img');
      img.src = `${window.hlx.codeBasePath}/icons/circle-check.svg`;
      img.alt = '';
      icon.append(img);
      last.prepend(icon);
    }

    const id = anchor?.textContent.trim();
    if (id) li.id = id.toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    list.append(li);
  });

  block.replaceChildren(list);
}
