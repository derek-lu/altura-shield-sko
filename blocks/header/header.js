import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Gives page headings an id when the content pipeline has not, so in-page
 * nav links (#what-we-did-and-when-we-did-it) always have a target.
 */
function ensureHeadingIds() {
  document.querySelectorAll('main h2:not([id]), main h3:not([id])').forEach((h) => {
    h.id = h.textContent.trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  });
}

/**
 * Altura Shield header. Reads the /nav document:
 * a logo link (optional), a list of page links, and one button, in any order.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('aria-label', 'Main');

  // sections are recognized by what they hold, so the logo section is optional
  const sections = fragment ? [...fragment.children] : [];
  const brand = sections.find((s) => s.querySelector('img, picture'));
  const links = sections.find((s) => s !== brand && s.querySelector('ul'));
  const tools = sections.find((s) => s !== brand && s !== links);

  if (brand) {
    brand.className = 'nav-brand';
    const link = brand.querySelector('a');
    if (link) {
      link.classList.remove('button');
      link.setAttribute('aria-label', 'Altura Shield home');
    }
    nav.append(brand);
  }
  if (links) {
    links.className = 'nav-links';
    nav.append(links);
  }
  if (tools) {
    tools.className = 'nav-tools';
    nav.append(tools);
  }

  if (!brand) nav.classList.add('no-brand');

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);

  ensureHeadingIds();
}
