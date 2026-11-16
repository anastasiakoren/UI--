import { expect, test } from '@playwright/test';

test('Standard user can sign in and see the product catalog', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

