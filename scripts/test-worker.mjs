import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium, expect } from '@playwright/test';

// Every external browser request is intercepted. Formspree is simulated;
// no form submission, email, analytics event, or payment leaves this test.
const port = Number(process.env.COOKSBRAD_TEST_PORT || 43158);
const origin = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, [
  'node_modules/wrangler/bin/wrangler.js', 'dev', '--local',
  '--ip', '127.0.0.1', '--port', String(port),
], {
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false',
    CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: 'false' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', chunk => { serverLog += chunk; });
server.stderr.on('data', chunk => { serverLog += chunk; });
let browser;
const result = { routes: 0, redirects: 0, assets: 0, protectedPaths: 0,
  browserPages: 0, formScenarios: [], mobileMenu: false, externalRequestsSent: 0 };
const routes = ['/', '/bar-mobile/', '/creations/', '/histoire/',
  '/contact/', '/mentions-legales/', '/confidentialite/'];

try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error('Wrangler exited: ' + serverLog);
    try {
      const response = await fetch(origin + '/', { signal: AbortSignal.timeout(1000) });
      if (response.status === 200) { ready = true; break; }
    } catch {}
    await delay(250);
  }
  assert(ready, 'Local Wrangler did not start: ' + serverLog);
  const references = new Set();
  for (const path of routes) {
    const response = await fetch(origin + path, { redirect: 'manual' });
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(response.headers.get('content-security-policy'), /connect-src[^;]*https:\/\/formspree.io/);
    assert.match(response.headers.get('cache-control'), /no-store/);
    const html = await response.text();
    assert.match(html, /Cooksbrad/i);
    assert(html.includes('href="https://www.cooksbrad.fr' + path + '"'), 'Canonical ' + path);
    for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
      const url = new URL(match[1], origin + path);
      if (url.origin === origin) references.add(url.pathname);
    }
    const head = await fetch(origin + path, { method: 'HEAD' });
    assert.equal(head.status, 200);
    result.routes++;
    if (path !== '/') {
      const response = await fetch(origin + path.slice(0, -1), { redirect: 'manual' });
      assert.equal(response.status, 307, 'Trailing slash redirect ' + path);
      assert.equal(new URL(response.headers.get('location'), origin).pathname, path);
      result.redirects++;
    }
  }
  for (const path of [...references]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, 'Referenced resource ' + path);
    if (path.endsWith('.css')) {
      const css = await response.text();
      for (const match of css.matchAll(/url\((["']?)([^)'"]+)\1\)/g)) {
        const url = new URL(match[1] ?? match[2] ?? match[3], origin + path);
        if (url.origin === origin) references.add(url.pathname);
      }
    }
  }
  for (const path of references) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, 'Referenced resource/font ' + path);
  }
  result.assets = references.size;
  for (const path of ['/missing-cooksbrad-page', '/.env', '/.git/config',
    '/.npmrc', '/wrangler.json', '/src/pages/index.astro']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, path);
    const html = await response.text();
    assert.match(html, /Page introuvable/);
    assert.match(html, /noindex/);
    result.protectedPaths++;
  }
  for (const path of ['/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /https:\/\/www.cooksbrad.fr/);
  }

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  let mode = null;
  let submissions = 0;
  const pageErrors = [];
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (url.origin === 'https://formspree.io') {
      submissions++;
      assert(mode, 'Unexpected form submission');
      assert.equal(route.request().method(), 'POST');
      assert.match(url.pathname, /^\/f\/[a-zA-Z0-9]+$/);
      if (mode === 'network-error') return route.abort('failed');
      return route.fulfill({ status: mode === 'success' ? 200 : 422,
        contentType: 'application/json', body: mode === 'success' ? '{"ok":true}' : '{"error":"Simulated"}',
        headers: { 'access-control-allow-origin': origin } });
    }
    return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => pageErrors.push(error.message));
  for (const path of routes) {
    await page.goto(origin + path, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toHaveCount(1);
    assert.equal(await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth + 1), false, 'Desktop overflow ' + path);
    assert.equal(await page.locator('img').evaluateAll(images =>
      images.filter(img => img.complete && img.naturalWidth === 0).length), 0, 'Broken image ' + path);
    result.browserPages++;
  }
  async function completeForm() {
    await page.locator('#contact-nom').fill('Recette');
    await page.locator('#contact-prenom').fill('Cooksbrad');
    await page.locator('#contact-phone').fill('0600000000');
    await page.locator('#contact-email').fill('recette@example.invalid');
    await page.locator('#contact-date').fill('2027-06-15');
    await page.locator('#contact-lieu').fill('Ville de test');
    await page.locator('#contact-invites').fill('20');
    await page.locator('#contact-type').selectOption('Autre');
    await page.locator('#contact-message').fill('Simulation locale de recette. Aucun envoi reel.');
    await page.locator('#contact-consent').check();
  }
  await page.goto(origin + '/contact/', { waitUntil: 'networkidle' });
  const submit = page.getByRole('button', { name: 'Recevoir mon devis' });
  await expect(submit).toBeDisabled();
  await completeForm();
  await page.locator('#contact-date').fill('');
  await submit.click();
  assert.equal(submissions, 0, 'Invalid date must prevent submission');
  result.formScenarios.push('required-date-and-consent');
  await page.locator('#contact-date').fill('2027-06-15');
  mode = 'success';
  await submit.click();
  await expect(page.getByRole('status')).toContainText('Demande envoyée');
  assert.equal(submissions, 1);
  result.formScenarios.push('success-mocked');
  for (const nextMode of ['server-error', 'network-error']) {
    mode = nextMode;
    await page.goto(origin + '/contact/', { waitUntil: 'networkidle' });
    await completeForm();
    await page.getByRole('button', { name: 'Recevoir mon devis' }).click();
    await expect(page.getByRole('alert')).toContainText('Une erreur est survenue');
    result.formScenarios.push(nextMode + '-mocked');
  }
  assert.equal(submissions, 3);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu de navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Créations', exact: true }).click();
  await expect(page).toHaveURL(origin + '/creations/');
  result.mobileMenu = true;
  for (const path of routes) {
    await page.goto(origin + path, { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth + 1), false, 'Mobile overflow ' + path);
    result.browserPages++;
  }
  assert.deepEqual(pageErrors, [], 'Browser runtime errors');
  console.log(JSON.stringify({ passed: true, ...result }, null, 2));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  await Promise.race([once(server, 'exit').catch(() => {}), delay(3000)]);
  if (server.exitCode === null) server.kill('SIGKILL');
}
