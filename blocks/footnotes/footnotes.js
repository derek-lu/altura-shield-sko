/**
 * Footnotes: one row per note. | number | text |
 * Each note gets id="fn{n}", and every <sup>n</sup> on the page links to it.
 * @param {Element} block The footnotes block element
 */
export default function decorate(block) {
  const list = document.createElement('ol');
  list.className = 'footnotes-list';

  [...block.children].forEach((row) => {
    const [num, text] = row.children;
    const n = num?.textContent.trim();
    if (!n || !text) return;
    const li = document.createElement('li');
    li.id = `fn${n}`;
    li.value = Number(n) || undefined;
    li.dataset.footnote = n;
    li.append(...(text.querySelector('p') ? text.querySelector('p').childNodes : text.childNodes));
    list.append(li);
  });

  block.replaceChildren(list);

  // link footnote markers in page copy to their note
  document.querySelectorAll('main sup').forEach((sup) => {
    const n = sup.textContent.trim();
    if (sup.querySelector('a') || !list.querySelector(`#fn${n}`)) return;
    const a = document.createElement('a');
    a.href = `#fn${n}`;
    a.textContent = n;
    a.setAttribute('aria-label', `Footnote ${n}`);
    sup.replaceChildren(a);
  });
}
