# Sarvesh Teacher Manager — AI Lesson Plan PWA

This package is based on the uploaded `PWA-main` repository.

## Added
- AI Lesson Plan Generator inside the existing Lesson Plan module.
- Enter/select **Class**, **Subject**, and **Chapter Name**.
- Click **✨ Generate with AI**.
- AI fills the existing lesson-plan fields.
- All generated fields remain editable.
- Existing save/search/edit/print workflow remains in the same app.
- API key is NOT stored in the HTML or GitHub repository.

## Required deployment

The frontend can remain in GitHub, but the AI endpoint must run on a serverless platform such as Cloudflare Pages Functions.

### Cloudflare Pages
1. Push this package to the GitHub repository.
2. In Cloudflare Pages, connect the repository.
3. Framework preset: None.
4. Build command: leave empty.
5. Build output directory: `/`.
6. Add an encrypted environment variable/secret:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI API key.
7. Deploy/redeploy.

The function is:
`functions/api/generate-lesson-plan.js`

The frontend calls:
`/api/generate-lesson-plan`

## Important
Do NOT put the OpenAI API key in `index.html`, JavaScript in the browser, GitHub, or this ZIP.

GitHub Pages by itself cannot execute the `functions/api/generate-lesson-plan.js` server function. If you continue using only GitHub Pages, the normal PWA modules will work but AI generation will not have a secure backend.

## PWA
The existing manifest and service worker are preserved and updated. AI API requests are explicitly excluded from service-worker caching.
