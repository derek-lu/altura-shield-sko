/**
 * FAQ: one row per question. | question | answer |
 * Also adds FAQPage structured data built from the same rows, so search
 * engines and AI assistants read the approved answers.
 * @param {Element} block The faq block element
 */
export default function decorate(block) {
  const entities = [];

  [...block.children].forEach((row) => {
    row.classList.add('faq-item');
    const [q, a] = row.children;
    if (!q || !a) return;
    const h3 = document.createElement('h3');
    h3.textContent = q.textContent.trim();
    q.replaceWith(h3);
    a.classList.add('faq-answer');
    entities.push({
      '@type': 'Question',
      name: h3.textContent,
      acceptedAnswer: { '@type': 'Answer', text: a.textContent.trim().replace(/\s+/g, ' ') },
    });
  });

  if (entities.length && !document.head.querySelector('script[data-faq-schema]')) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.faqSchema = '';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: entities });
    document.head.append(script);
  }
}
