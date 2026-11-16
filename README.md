# Recuply

Recuply is a school-first lost-and-found project. This repository contains its public website and contact form, not the lost-and-found application itself.

Website: https://www.recuply.biz/

## Project structure

- `index.html`, `about/`, `contact/`, `faq/`, `for-schools/`, `how-it-works/`: website pages.
- `style.css`, `app.js`, `favicon.svg`, `recuply-mark.svg` and `items-web.jpg`: styles, interactions and visual assets.
- `api/enquiry.js`: Vercel function that validates enquiries and sends them through Resend.

## Local preview

Run `python3 -m http.server 8000` in the project directory and open `http://localhost:8000/`. This previews the static pages only; Python's static server does not run the contact form backend. For the complete flow use the Vercel CLI and run `vercel dev` with the environment variable below configured.

## Contact form

Configure `RESEND_API_KEY` and `CONTACT_TO_EMAIL` as sensitive environment variables in Vercel. Set `CONTACT_TO_EMAIL` to the address that should receive enquiries. Use a sending-only API key for the verified `recuply.biz` domain. The function sends enquiries to the configured recipient in `api/enquiry.js` and sets the visitor's email as the reply-to address. Never commit API keys or `.env` files.

Resend is configured for sending. Receiving messages addressed directly to `info@recuply.biz` requires separate mailbox or forwarding setup.

## Deployment

The site is deployed on Vercel as a static site with a serverless function. Import the repository into Vercel, set `RESEND_API_KEY` for the intended environments, deploy, and configure the custom domain in Vercel and its DNS provider. A change to environment variables requires a new deployment.

The repository does not contain an API key. The form needs a configured key and a verified sending domain before real email delivery works.
