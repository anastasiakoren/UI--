import { expect, test } from '@playwright/test';

test('Standard user can check out with the correct order total', async ({ page }) => {
  const productName = 'Sauce Labs Backpack';

  await test.step('Sign in', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
  });

  await test.step('Add the backpack and verify the cart', async () => {
    const product = page.locator('[data-test="inventory-item"]').filter({
      has: page.getByText(productName, { exact: true }),
    });
    await product.getByRole('button', { name: 'Add to cart', exact: true }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    const cartItem = page.locator('[data-test="inventory-item"]');
    await expect(cartItem).toHaveCount(1);
    await expect(cartItem.getByText(productName, { exact: true })).toBeVisible();
    await expect(cartItem.getByText('$29.99', { exact: true })).toBeVisible();
    await expect(cartItem.locator('[data-test="item-quantity"]')).toHaveText('1');
  });

  await test.step('Enter checkout information', async () => {
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('Customer');
    await page.getByPlaceholder('Zip/Postal Code').fill('10001');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
  });

  await test.step('Verify the order summary and confirm checkout', async () => {
    await expect(page.getByText(productName, { exact: true })).toBeVisible();
    await expect(page.getByText('Item total: $29.99', { exact: true })).toBeVisible();
    await expect(page.getByText('Tax: $2.40', { exact: true })).toBeVisible();
    await expect(page.getByText('Total: $32.39', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Finish', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!', exact: true })).toBeVisible();
  });
});
