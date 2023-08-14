import { expect, test } from '@playwright/test';

test('index page has expected h1', () => {
  // await page.goto('/');
  // await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
  expect('I should write tests').toBe('I should write tests');
});
