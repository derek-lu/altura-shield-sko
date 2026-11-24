# Altura Shield demo site

An AEM Edge Delivery Services demo featuring the Altura Shield case study at
`/partners/rapid-response`, including its `#briefing` and `#advisory` anchors.

## Case study deployment

The supplied case-study package's `code/` directory is installed at the repository
root. Its colors, self-hosted fonts, header, and footer apply site-wide; this is
intended for a dedicated Altura Shield demo site.

Code deploys by pushing to `main`. Content is uploaded separately from the supplied
package using `upload-to-da.sh`, with `DA_ORG=derek-lu`,
`DA_SITE=altura-shield-sko`, and a locally supplied `DA_TOKEN` IMS access token.
Never commit the token.

After uploading, open, preview, and publish these documents in da.live:

- `/partners/rapid-response`
- `/partners/rapid-response-nav`
- `/partners/rapid-response-footer`

The page metadata selects its own nav and footer, leaving site-wide `/nav` and
`/footer` documents unchanged. The banner lives at
`/partners/media/altura-shield-case-study-banner.jpg`.

The response times, event and briefing dates, and address are demo values.
Advisory and privacy URLs use `www.alturashield.example`. The briefing form only
shows a local thank-you message until an author adds an `Action` row pointing
to a registration endpoint.

## Environments
- Preview: https://main--altura-shield-sko--derek-lu.aem.page/
- Live: https://main--altura-shield-sko--derek-lu.aem.live/

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `altura-shield-sko` directory in your favorite IDE and start coding :)
