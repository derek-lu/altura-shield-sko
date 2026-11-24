const COPY_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

/** Footnote text by number, read from the footnotes block on the page. */
function footnoteText(n) {
  const item = document.querySelector(`.footnotes [data-footnote="${n}"]`);
  return item ? item.textContent.trim() : '';
}

/**
 * Builds the text a partner pastes: numbered lines, footnote markers as [n],
 * and the footnote text appended so line 1 always travels with its source.
 */
function copyText(body) {
  const list = body.querySelector('ol, ul');
  if (list) {
    const notes = new Set();
    const lines = [...list.children].map((li, i) => {
      const clone = li.cloneNode(true);
      clone.querySelectorAll('sup').forEach((sup) => {
        const n = sup.textContent.trim();
        notes.add(n);
        sup.replaceWith(` [${n}]`);
      });
      return `${i + 1}. ${clone.textContent.trim()}`;
    });
    const tail = [...notes].map((n) => `[${n}] ${footnoteText(n)}`).filter((t) => t.length > 4);
    return [lines.join('\n'), tail.join('\n')].filter(Boolean).join('\n\n');
  }
  const quote = body.querySelector('blockquote') || body;
  return quote.textContent.trim();
}

/**
 * Copy Cards: one row per card. | label, heading, approved text | note under the button |
 * The approved text is a numbered list or a quote; the button copies it as written.
 * @param {Element} block The copy-cards block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('copy-card');
    const [body, note] = row.children;
    body?.classList.add('copy-card-body');

    const label = body?.querySelector(':scope > p:first-child');
    if (label && label.nextElementSibling?.tagName === 'H3') label.classList.add('copy-card-label');

    const foot = document.createElement('div');
    foot.className = 'copy-card-foot';
    const heading = body?.querySelector('h3')?.textContent.trim() || 'text';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-card-button';
    button.dataset.event = 'call-lines-copy';
    const what = body?.querySelector('ol, ul') ? 'Copy the lines' : 'Copy the text';
    button.innerHTML = `${COPY_ICON}<span>${what}</span>`;
    button.setAttribute('aria-label', `${what}: ${heading}`);

    const status = document.createElement('span');
    status.className = 'copy-card-status';
    status.setAttribute('role', 'status');

    button.addEventListener('click', async () => {
      const labelEl = button.querySelector('span');
      const original = labelEl.textContent;
      let ok = false;
      try {
        await navigator.clipboard.writeText(copyText(body));
        ok = true;
      } catch (e) {
        ok = false;
      }
      labelEl.textContent = ok ? 'Copied' : 'Select the text to copy';
      status.textContent = ok ? 'Copied to your clipboard' : '';
      setTimeout(() => { labelEl.textContent = original; status.textContent = ''; }, 2200);
    });

    foot.append(button);
    if (note) {
      note.className = 'copy-card-note';
      foot.append(note);
    }
    foot.append(status);
    row.append(foot);
  });
}
