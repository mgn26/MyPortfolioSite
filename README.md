This is a [Next.js](https://nextjs.org) portfolio site. Content is loaded from [PocketBase](https://pocketbase.io) when configured, with a static fallback in `src/content/site.ts`.

## Environment variables

Create `.env.local` in the project root (gitignored). Required for PocketBase content in dev and production:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_POCKETBASE_URL` | Yes | Public PocketBase HTTPS URL (no trailing slash) |
| `POCKETBASE_URL` | Production only | Internal HTTP URL for server-side fetches on Dokploy |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Optional | Contact form email (server-only) |

## PocketBase (Dokploy)

1. Create `.env.local` locally with `NEXT_PUBLIC_POCKETBASE_URL` set to your PocketBase API base URL (HTTPS, no trailing slash).
2. Bootstrap collections and seed data (admin credentials only — not used by the app):

```bash
POCKETBASE_URL=https://your-pocketbase.example.com \
POCKETBASE_ADMIN_EMAIL=you@example.com \
POCKETBASE_ADMIN_PASSWORD=your-admin-password \
npm run setup:pocketbase
```

If the server uses a temporary/self-signed TLS certificate, add `POCKETBASE_INSECURE_SKIP_TLS=true` for the setup command only.

The setup script updates collection schemas and only **creates** missing seed records. It does **not** overwrite an existing `site_profile` or change socials/projects that are already there.

3. Edit content in the PocketBase admin UI (`/_/`) under **site_profile**, **socials**, and **projects**.
4. Upload **profileImage** on `site_profile` and optional **image** on each project.

### Dokploy checklist

**PocketBase compose**

- Domain: HTTPS enabled (Let's Encrypt).
- **Isolated deployment:** off (or add `traefik.docker.network=<appName>` to the service).
- After changing domains, redeploy the compose stack.

**PocketBase CORS**

- Not required for this portfolio: Next.js fetches PocketBase **on the server**, so the browser never calls the PocketBase API directly.
- PocketBase also allows all origins by default (`*`). There is no CORS setting in the admin UI (`/_/`).
- Only if you later add browser-side PocketBase requests would you restrict origins via the PocketBase `--origins` startup flag in the compose service.

**Portfolio Next.js app** (new Dokploy application)

- Build: `npm run build` / Start: `npm run start` (or Nixpacks).
- Environment:
  - `NEXT_PUBLIC_POCKETBASE_URL` — public HTTPS URL for PocketBase
  - `POCKETBASE_URL` — internal HTTP URL for server-side fetches (Docker/Dokploy only)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` — for the contact form

**PocketBase custom domain (recommended)**

- Add a subdomain (e.g. `cms.your-domain.com`) on the PocketBase compose service (HTTPS / Let's Encrypt).
- Point DNS at your server, then redeploy the compose stack.

**Contact form**

- Recipient email is read from `site_profile.contactEmail` in PocketBase (not from the form).
- WhatsApp number is read from `site_profile.contactWhatsapp` and shown as a `wa.me` link.

## Getting Started

```bash
npm install

# Create .env.local (not committed — see Environment variables above)
# Example:
#   NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase.example.com

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Collections

| Collection     | Purpose |
|----------------|---------|
| `site_profile` | Name, role, quote, quote attribution, bio, initials, profile image, contact email & WhatsApp |
| `skills`       | Skill rows (`category` + `name`, ordered by `sort`) grouped on the About page |
| `interests`    | Interest labels (`sort` order) on the About page |
| `socials`      | Social links (`sort` order, `enabled` toggle to show/hide) |
| `projects`     | Project cards (`category`: `software-engineering` or `cybersecurity`) |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)
