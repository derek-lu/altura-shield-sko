/**
 * Briefing registration form. The fields are fixed in code; authors set the copy:
 * | Button | ... |  | Consent | ... |  | Thank you title | ... |  | Thank you text | ... |
 * Optional: | Action | https://... | posts the form as JSON to that endpoint.
 * Without an Action row the form validates and shows the thank-you message only.
 * The section holding this block gets id="briefing" so #briefing links land here.
 * @param {Element} block The briefing block element
 */
const FIELDS = [
  {
    name: 'firstName', label: 'First name', autocomplete: 'given-name', half: true,
  },
  {
    name: 'lastName', label: 'Last name', autocomplete: 'family-name', half: true,
  },
  {
    name: 'email', label: 'Work email', autocomplete: 'email', type: 'email',
  },
  { name: 'company', label: 'Company', autocomplete: 'organization' },
];

function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const [k, v] = row.children;
    if (!k || !v) return;
    const key = k.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    config[key] = v;
  });
  return config;
}

function field({
  name, label, autocomplete, type = 'text',
}) {
  const wrap = document.createElement('label');
  wrap.textContent = label;
  const input = document.createElement('input');
  input.name = name;
  input.type = type;
  input.required = true;
  input.autocomplete = autocomplete;
  wrap.append(input);
  return wrap;
}

export default function decorate(block) {
  const config = readConfig(block);
  const text = (key, fallback) => config[key]?.textContent.trim() || fallback;

  const section = block.closest('.section');
  if (section && !document.getElementById('briefing')) section.id = 'briefing';

  const form = document.createElement('form');
  form.noValidate = true;
  form.className = 'briefing-form';

  const two = document.createElement('div');
  two.className = 'briefing-row';
  FIELDS.filter((f) => f.half).forEach((f) => two.append(field(f)));
  form.append(two);
  FIELDS.filter((f) => !f.half).forEach((f) => form.append(field(f)));

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button primary';
  button.dataset.event = 'briefing-registration-complete';
  button.textContent = text('button', 'Register');
  form.append(button);

  const message = document.createElement('small');
  message.className = 'briefing-message';
  message.setAttribute('role', 'status');
  if (config.consent) message.append(...config.consent.childNodes);
  form.append(message);

  const thanks = document.createElement('div');
  thanks.className = 'briefing-thanks';
  thanks.tabIndex = -1;
  thanks.setAttribute('role', 'status');
  thanks.hidden = true;
  const h3 = document.createElement('h3');
  h3.innerHTML = `<img src="${window.hlx.codeBasePath}/icons/circle-check.svg" alt="" width="24" height="24"> `;
  h3.append(text('thank-you-title', 'You are registered'));
  const p = document.createElement('p');
  p.textContent = text('thank-you-text', '');
  thanks.append(h3, p);

  const action = config.action?.querySelector('a')?.href || text('action', '');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const missing = [...form.querySelectorAll('input')].filter((i) => !i.checkValidity());
    if (missing.length) {
      const note = form.querySelector('.briefing-error') || document.createElement('p');
      note.className = 'briefing-error';
      note.textContent = 'Please fill in every field with a valid work email.';
      button.before(note);
      missing[0].focus();
      return;
    }
    if (action) {
      button.disabled = true;
      try {
        const data = Object.fromEntries(new FormData(form).entries());
        const resp = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });
        if (!resp.ok) throw new Error(resp.status);
      } catch (err) {
        button.disabled = false;
        const note = form.querySelector('.briefing-error') || document.createElement('p');
        note.className = 'briefing-error';
        note.textContent = 'Something went wrong. Please try again.';
        button.before(note);
        return;
      }
    }
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  });

  block.replaceChildren(form, thanks);
}
