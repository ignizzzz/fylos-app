#!/usr/bin/env node
/* ==========================================================================
   check-website-shell.mjs  ·  zero-dependency validator for the website shell

   Enforces the shell's hard constraints on the pages it owns:
     1. no dead links  (href="#" / empty / javascript:void)
     2. every internal clean-route link is a real route from docs/ROUTES.md
     3. every /shell/* asset link resolves to a file under website-live/
     4. every same-page #anchor has a matching id
     5. the mobile menu keeps its required accessibility attributes
        (skip target, burger aria-expanded/aria-controls, dialog role, close btn)

   Scope: only the files this shell task owns. It deliberately does NOT police
   other sessions' pages, nor the film's locked assets (image files are not
   committed on this branch and are served from Vercel).

   Usage:  node scripts/check-website-shell.mjs
   Exit:   0 = all good, 1 = one or more failures
   ========================================================================== */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'website-live');

// Auto-discover the pages that actually use this shell (they carry the
// data-fy-header marker). This keeps the check honest as pages get wired in
// over time, and avoids false failures on pages another session owns or on a
// page that has not been retrofitted yet.
const FULL_PAGES = readdirSync(SITE)
  .filter((f) => f.endsWith('.html'))
  .filter((f) => readFileSync(join(SITE, f), 'utf8').includes('data-fy-header'));
const PARTIALS = ['shell/header.html', 'shell/footer.html'];

const problems = [];
const notes = [];
function fail(file, msg) { problems.push(`${file}: ${msg}`); }

/* ---- 1. read the allowed website routes straight from docs/ROUTES.md ------ */
function loadRoutes() {
  const md = readFileSync(join(ROOT, 'docs', 'ROUTES.md'), 'utf8');
  const start = md.indexOf('## 1. Website routes');
  const end = md.indexOf('## 2.', start);
  const section = md.slice(start, end === -1 ? undefined : end);
  const routes = new Set();
  // table rows begin: | `/route` | `file` | ...
  const re = /^\|\s*`(\/[^`]*)`\s*\|/gm;
  let m;
  while ((m = re.exec(section))) routes.add(normalize(m[1]));
  return routes;
}

function normalize(p) {
  p = String(p).split('#')[0].split('?')[0];
  p = p.replace(/\/index\.html?$/i, '/').replace(/\.html?$/i, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

/* ---- helpers -------------------------------------------------------------- */
function attrs(html, name) {
  // collect all values of a given attribute
  const out = [];
  const re = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'gi');
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}
function ids(html) {
  const set = new Set();
  const re = /\bid\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) set.add(m[1]);
  return set;
}

/* ---- link checks (dead / route / asset / anchor) -------------------------- */
function checkLinks(rel, html, routes, isPartial) {
  const pageIds = ids(html);
  const links = [...attrs(html, 'href'), ...attrs(html, 'src')];
  for (const raw of links) {
    const href = raw.trim();

    // 1. dead links
    if (href === '' || href === '#' || /^javascript:/i.test(href)) {
      fail(rel, `dead link href/src="${raw}"`);
      continue;
    }
    // scheme links (http, mailto, tel, sms, data) — accepted as real
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) continue;
    // protocol-relative
    if (href.startsWith('//')) continue;

    // 4. same-page anchor (partials are fragments: their #target ids live in
    //    the host page, so only validate anchors on full pages)
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!isPartial && id && !pageIds.has(id)) fail(rel, `anchor "${href}" has no matching id`);
      continue;
    }

    // internal path
    if (href.startsWith('/')) {
      // 3. shell asset (has an extension)
      if (/\.[a-z0-9]+$/i.test(href.split('#')[0].split('?')[0])) {
        const p = join(SITE, href.split('#')[0].split('?')[0]);
        if (!existsSync(p)) fail(rel, `asset "${href}" does not resolve to a file under website-live/`);
        continue;
      }
      // 2. clean route: must be sanctioned in docs/ROUTES.md. No physical-file
      //    escape hatch: website-live/ holds many non-route pages (demo.html,
      //    product.html, ...) and a nav/footer link must never point at one.
      const norm = normalize(href);
      if (!routes.has(norm)) {
        fail(rel, `link "${href}" is not a route in docs/ROUTES.md`);
      }
      continue;
    }

    // relative path: only validate shell/* and .html targets; image assets are
    // served from Vercel and not committed on this branch, so skip those.
    const clean = href.split('#')[0].split('?')[0];
    if (clean.startsWith('shell/') || /\.html?$/i.test(clean)) {
      const p = join(SITE, dirname(rel).replace(/^website-live\/?/, '') || '.', clean);
      if (!existsSync(p) && !existsSync(join(SITE, clean))) {
        fail(rel, `relative link "${href}" does not resolve`);
      }
    }
  }
}

/* ---- accessibility checks (full pages only) ------------------------------- */
function checkA11y(rel, html) {
  const pageIds = ids(html);

  // skip link + target
  if (!/class="fy-skip"[^>]*href="#([^"]+)"/.test(html)) {
    fail(rel, 'missing skip link (.fy-skip href="#...")');
  } else {
    const target = html.match(/class="fy-skip"[^>]*href="#([^"]+)"/)[1];
    if (!pageIds.has(target)) fail(rel, `skip link target #${target} not found`);
  }

  // burger button
  const burger = html.match(/<button[^>]*data-fy-burger[^>]*>/i);
  if (!burger) {
    fail(rel, 'missing mobile menu button (data-fy-burger)');
  } else {
    const b = burger[0];
    if (!/aria-expanded="false"/.test(b)) fail(rel, 'burger missing aria-expanded="false"');
    const ac = b.match(/aria-controls="([^"]+)"/);
    if (!ac) fail(rel, 'burger missing aria-controls');
    else if (!pageIds.has(ac[1])) fail(rel, `burger aria-controls="${ac[1]}" has no matching element id`);
    if (!/aria-label="[^"]+"/.test(b)) fail(rel, 'burger missing aria-label');
  }

  // dialog panel
  if (!/role="dialog"/.test(html) || !/aria-modal="true"/.test(html)) {
    fail(rel, 'mobile menu panel missing role="dialog" aria-modal="true"');
  }
  if (!/data-fy-close/.test(html)) fail(rel, 'mobile menu missing a close control (data-fy-close)');

  // one main landmark for the skip target
  if (!/<main[^>]*id="fy-main"/.test(html)) fail(rel, 'missing <main id="fy-main"> landmark');

  // shell assets linked
  if (!/href="\/shell\/shell\.css"/.test(html)) fail(rel, 'shell.css not linked');
  if (!/src="\/shell\/shell\.js"/.test(html)) fail(rel, 'shell.js not linked');
}

/* ---- run ------------------------------------------------------------------ */
const routes = loadRoutes();
notes.push(`routes from docs/ROUTES.md: ${[...routes].sort().join(', ')}`);
notes.push(`shell pages found: ${FULL_PAGES.length ? FULL_PAGES.join(', ') : '(none yet)'}`);

for (const rel of FULL_PAGES) {
  const p = join(SITE, rel);
  if (!existsSync(p)) { fail(rel, 'file not found'); continue; }
  const html = readFileSync(p, 'utf8');
  checkLinks(`website-live/${rel}`, html, routes, false);
  checkA11y(`website-live/${rel}`, html);
}
for (const rel of PARTIALS) {
  const p = join(SITE, rel);
  if (!existsSync(p)) { fail(rel, 'file not found'); continue; }
  checkLinks(`website-live/${rel}`, readFileSync(p, 'utf8'), routes, true);
}

/* ---- report --------------------------------------------------------------- */
console.log('website shell check');
for (const n of notes) console.log('  · ' + n);
if (problems.length) {
  console.log(`\n  ${problems.length} problem(s):`);
  for (const p of problems) console.log('  ✗ ' + p);
  process.exit(1);
}
console.log('\n  ✓ all shell pages pass (links, routes, anchors, accessibility)');
