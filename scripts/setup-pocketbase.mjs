/**
 * Bootstrap PocketBase collections, API rules, and seed data for the portfolio site.
 *
 * Usage:
 *   POCKETBASE_URL=https://your-pb.example.com \
 *   POCKETBASE_ADMIN_EMAIL=admin@example.com \
 *   POCKETBASE_ADMIN_PASSWORD=secret \
 *   npm run setup:pocketbase
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/** Load KEY=value pairs from .env files without overwriting existing env. */
function loadEnvFiles(...paths) {
  for (const filePath of paths) {
    if (!existsSync(filePath)) continue;
    for (const line of readFileSync(filePath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

loadEnvFiles(
  join(ROOT, ".env.local"),
  join(ROOT, ".env.pocketbase"),
);

const PB_URL = (process.env.POCKETBASE_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL || "")
  .replace(/\/$/, "");
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!PB_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing env. Set POCKETBASE_URL, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD",
  );
  process.exit(1);
}

const seed = JSON.parse(
  readFileSync(join(__dirname, "seed-site.json"), "utf8"),
);

async function pbFetch(path, options = {}) {
  const fetchOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  if (process.env.POCKETBASE_INSECURE_SKIP_TLS === "true") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  let res;
  try {
    res = await fetch(`${PB_URL}${path}`, fetchOptions);
  } catch (err) {
    const hint =
      process.env.POCKETBASE_INSECURE_SKIP_TLS === "true"
        ? ""
        : " (try POCKETBASE_INSECURE_SKIP_TLS=true if the server uses a self-signed certificate)";
    throw new Error(`${err.message}${hint}`);
  }
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg =
      typeof body === "object" && body?.message
        ? body.message
        : text || res.statusText;
    throw new Error(`${options.method || "GET"} ${path} → ${res.status}: ${msg}`);
  }
  return body;
}

async function authenticate() {
  // PocketBase v0.23+ uses _superusers instead of legacy /api/admins
  const paths = [
    "/api/collections/_superusers/auth-with-password",
    "/api/admins/auth-with-password",
  ];

  let lastError;
  for (const path of paths) {
    try {
      const data = await pbFetch(path, {
        method: "POST",
        body: JSON.stringify({
          identity: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        }),
      });
      if (data?.token) {
        return `Bearer ${data.token}`;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("Authentication failed");
}

const PUBLIC_RULES = {
  listRule: "",
  viewRule: "",
  createRule: null,
  updateRule: null,
  deleteRule: null,
};

const ICON_VALUES = [
  "twitter",
  "youtube",
  "linkedin",
  "github",
  "instagram",
  "tiktok",
  "facebook",
  "reddit",
];
const STATUS_VALUES = ["live", "staging"];
const INVOLVEMENT_VALUES = ["gen-ai", "human", "both"];
const CATEGORY_VALUES = ["software-engineering", "cybersecurity"];

const COLLECTIONS = [
  {
    name: "site_profile",
    type: "base",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "role", type: "text", required: false },
      { name: "quote", type: "text", required: false },
      { name: "quoteAttribution", type: "text", required: false },
      { name: "bio", type: "text", required: false },
      { name: "initials", type: "text", required: false },
      {
        name: "profileImage",
        type: "file",
        required: false,
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      },
      { name: "contactEmail", type: "email", required: false },
      { name: "contactWhatsapp", type: "text", required: false },
    ],
    ...PUBLIC_RULES,
  },
  {
    name: "skills",
    type: "base",
    fields: [
      { name: "category", type: "text", required: true },
      { name: "name", type: "text", required: true },
      { name: "sort", type: "number", required: false },
    ],
    ...PUBLIC_RULES,
  },
  {
    name: "interests",
    type: "base",
    fields: [
      { name: "label", type: "text", required: true },
      { name: "sort", type: "number", required: false },
    ],
    ...PUBLIC_RULES,
  },
  {
    name: "socials",
    type: "base",
    fields: [
      { name: "href", type: "url", required: true },
      { name: "label", type: "text", required: true },
      {
        name: "icon",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ICON_VALUES,
      },
      { name: "sort", type: "number", required: false },
      { name: "enabled", type: "bool", required: false },
    ],
    ...PUBLIC_RULES,
  },
  {
    name: "projects",
    type: "base",
    fields: [
      { name: "title", type: "text", required: true },
      { name: "techStack", type: "json", required: false },
      {
        name: "status",
        type: "select",
        required: true,
        maxSelect: 1,
        values: STATUS_VALUES,
      },
      {
        name: "involvement",
        type: "select",
        required: true,
        maxSelect: 1,
        values: INVOLVEMENT_VALUES,
      },
      { name: "githubUrl", type: "url", required: false },
      { name: "url", type: "url", required: false },
      { name: "description", type: "text", required: false },
      { name: "accent", type: "text", required: false },
      {
        name: "image",
        type: "file",
        required: false,
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      },
      {
        name: "category",
        type: "select",
        required: true,
        maxSelect: 1,
        values: CATEGORY_VALUES,
      },
      { name: "sort", type: "number", required: false },
    ],
    ...PUBLIC_RULES,
  },
];

async function listCollections(token) {
  return pbFetch("/api/collections?perPage=200", {
    headers: { Authorization: token },
  });
}

async function ensureCollection(token, spec) {
  const existing = await listCollections(token);
  const found = existing.items?.find((c) => c.name === spec.name);

  const payload = {
    name: spec.name,
    type: spec.type,
    fields: spec.fields,
    listRule: spec.listRule,
    viewRule: spec.viewRule,
    createRule: spec.createRule,
    updateRule: spec.updateRule,
    deleteRule: spec.deleteRule,
  };

  if (found) {
    console.log(`  ↻ update collection: ${spec.name}`);
    await pbFetch(`/api/collections/${found.id}`, {
      method: "PATCH",
      headers: { Authorization: token },
      body: JSON.stringify({ ...payload, fields: undefined }),
    });
    // Patch fields separately when collection exists (PB merges field defs)
    await pbFetch(`/api/collections/${found.id}`, {
      method: "PATCH",
      headers: { Authorization: token },
      body: JSON.stringify({ fields: spec.fields }),
    });
    return found.name;
  }

  console.log(`  + create collection: ${spec.name}`);
  await pbFetch("/api/collections", {
    method: "POST",
    headers: { Authorization: token },
    body: JSON.stringify(payload),
  });
  return spec.name;
}

async function listRecords(token, collection, filter = "") {
  const q = new URLSearchParams({ perPage: 500 });
  if (filter) q.set("filter", filter);
  const data = await pbFetch(`/api/collections/${collection}/records?${q}`, {
    headers: { Authorization: token },
  });
  return data.items || [];
}

async function seedSiteProfile(token) {
  const existing = await listRecords(token, "site_profile");

  if (existing.length === 0) {
    console.log("  + create site_profile");
    await pbFetch("/api/collections/site_profile/records", {
      method: "POST",
      headers: { Authorization: token },
      body: JSON.stringify(seed.site_profile),
    });
    return;
  }

  const profile = existing[0];
  const patch = {};
  if (!profile.quote && seed.site_profile.quote) {
    patch.quote = seed.site_profile.quote;
  }
  if (!profile.quoteAttribution && seed.site_profile.quoteAttribution) {
    patch.quoteAttribution = seed.site_profile.quoteAttribution;
  }

  if (Object.keys(patch).length === 0) {
    console.log("  · site_profile already exists (left unchanged)");
    return;
  }

  await pbFetch(`/api/collections/site_profile/records/${profile.id}`, {
    method: "PATCH",
    headers: { Authorization: token },
    body: JSON.stringify(patch),
  });
  console.log(
    `  ↻ site_profile filled missing quote field(s): ${Object.keys(patch).join(", ")}`,
  );
}

async function seedSkills(token) {
  const existing = await listRecords(token, "skills");
  const byKey = new Map(
    existing.map((row) => [`${row.category}::${row.name}`, row]),
  );

  let created = 0;
  for (const row of seed.skills) {
    const key = `${row.category}::${row.name}`;
    if (byKey.has(key)) continue;

    await pbFetch("/api/collections/skills/records", {
      method: "POST",
      headers: { Authorization: token },
      body: JSON.stringify(row),
    });
    created += 1;
  }

  if (created > 0) {
    console.log(`  + added ${created} skill(s)`);
  } else if (existing.length === 0) {
    console.log(`  + seeded ${seed.skills.length} skills`);
  } else {
    console.log(`  · skills up to date (${existing.length} records)`);
  }
}

async function seedInterests(token) {
  const existing = await listRecords(token, "interests");
  const byLabel = new Map(existing.map((row) => [row.label, row]));

  let created = 0;
  for (const row of seed.interests) {
    if (byLabel.has(row.label)) continue;

    await pbFetch("/api/collections/interests/records", {
      method: "POST",
      headers: { Authorization: token },
      body: JSON.stringify(row),
    });
    created += 1;
  }

  if (created > 0) {
    console.log(`  + added ${created} interest(s)`);
  } else if (existing.length === 0) {
    console.log(`  + seeded ${seed.interests.length} interests`);
  } else {
    console.log(`  · interests up to date (${existing.length} records)`);
  }
}

async function seedSocials(token) {
  const existing = await listRecords(token, "socials");
  const byIcon = new Map(existing.map((row) => [row.icon, row]));

  let created = 0;
  for (const row of seed.socials) {
    if (byIcon.has(row.icon)) continue;

    await pbFetch("/api/collections/socials/records", {
      method: "POST",
      headers: { Authorization: token },
      body: JSON.stringify(row),
    });
    created += 1;
  }

  if (created > 0) {
    console.log(`  + added ${created} social(s)`);
  } else if (existing.length === 0) {
    console.log(`  + seeded ${seed.socials.length} socials`);
  } else {
    console.log(`  · socials up to date (${existing.length} records)`);
  }
}

async function seedProjects(token) {
  const existing = await listRecords(token, "projects");

  if (existing.length === 0) {
    for (const row of seed.projects) {
      await pbFetch("/api/collections/projects/records", {
        method: "POST",
        headers: { Authorization: token },
        body: JSON.stringify(row),
      });
    }
    console.log(`  + seeded ${seed.projects.length} projects`);
    return;
  }

  const byTitle = new Map(existing.map((row) => [row.title, row]));
  let updated = 0;

  for (const row of seed.projects) {
    const record = byTitle.get(row.title);
    if (!record) continue;

    const needsUpdate =
      !record.category ||
      record.category !== row.category ||
      JSON.stringify(record.techStack ?? []) !== JSON.stringify(row.techStack ?? []);

    if (!needsUpdate) continue;

    await pbFetch(`/api/collections/projects/records/${record.id}`, {
      method: "PATCH",
      headers: { Authorization: token },
      body: JSON.stringify({
        category: row.category,
        techStack: row.techStack,
        status: row.status,
        involvement: row.involvement,
        sort: row.sort,
      }),
    });
    updated += 1;
  }

  console.log(
    updated > 0
      ? `  ↻ updated ${updated} project(s)`
      : `  · projects already seeded (${existing.length} records)`,
  );
}

async function main() {
  console.log(`PocketBase: ${PB_URL}`);
  console.log("Authenticating…");
  const token = await authenticate();

  console.log("Collections:");
  for (const spec of COLLECTIONS) {
    await ensureCollection(token, spec);
  }

  console.log("Seed data:");
  await seedSiteProfile(token);
  await seedSkills(token);
  await seedInterests(token);
  await seedSocials(token);
  await seedProjects(token);

  console.log("\nDone. Edit content at " + PB_URL + "/_/");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
