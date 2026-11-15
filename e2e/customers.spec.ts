import { test, expect } from '@playwright/test';

test('JSON thật, 2 nhóm, 5 khách hàng và ảnh PNG tải thành công', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await request.get('/assets/data/customers.json');
  expect(response.status()).toBe(200);
  const groups = await response.json();
  expect(groups.map((g: { CustomerTypeId: number; CustomterTypeName: string; Customers: unknown[] }) =>
    [g.CustomerTypeId, g.CustomterTypeName, g.Customers.length]
  )).toEqual([[1, 'VIP', 3], [2, 'Normal', 2]]);

  await page.goto('/');
  await expect(page).toHaveURL(/\/customers$/);
  await expect(page.locator('.group-row')).toHaveText(['1 - VIP', '2 - Normal']);
  const expected = [
    ['Cus123', 'Obama', 'obama@gmail.com', '67', 'obama-avatar.png'],
    ['Cus456', 'Kim jong Un', 'unun@gmail.com', '38', 'unun-avatar.png'],
    ['Cus789', 'Putin', 'putin@gmail.com', '77', 'putin-avatar.png'],
    ['Cus000', 'Hồ Cẩm Đào', 'hodao@gmail.com', '16', 'hodao-avatar.png'],
    ['Cus111', 'Tap Can Binh', 'binhbinh@gmail.com', '67', 'binhbinh-avatar.png']
  ];
  await expect(page.locator('.customer-row')).toHaveCount(5);
  await expect(page.locator('tbody').nth(0).locator('.customer-row')).toHaveCount(3);
  await expect(page.locator('tbody').nth(1).locator('.customer-row')).toHaveCount(2);
  for (const [index, customer] of expected.entries()) {
    const row = page.locator('.customer-row').nth(index);
    await expect(row.locator('td').first()).toHaveText(customer[0]);
    await expect(row.locator('td').nth(1)).toHaveText(customer[1]);
    await expect(row.locator('td').nth(2)).toHaveText(customer[2]);
    await expect(row.locator('td').nth(3)).toHaveText(customer[3]);
    const img = row.locator('img');
    await expect(img).toHaveAttribute('src', `assets/avatars/${customer[4]}`);
    await expect(img).toHaveAttribute('alt', `Ảnh đại diện ${customer[1]}`);
    await expect.poll(() => img.evaluate((element: HTMLImageElement) =>
      element.complete && element.naturalWidth > 0)).toBe(true);
    const imageResponse = await request.get(`/assets/avatars/${customer[4]}`);
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()['content-type']).toContain('image/png');
    expect([... (await imageResponse.body()).subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  }
  await page.screenshot({ path: 'docs/customers-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('table')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'docs/customers-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('hiển thị loading trong lúc HTTP chưa hoàn tất', async ({ page }) => {
  let release!: () => void;
  const waiting = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/assets/data/customers.json', async route => {
    await waiting;
    await route.continue();
  });
  await page.goto('/customers');
  await expect(page.getByRole('status')).toHaveText('Đang tải danh sách khách hàng…');
  await expect(page.locator('table')).toHaveCount(0);
  release();
  await expect(page.locator('.customer-row')).toHaveCount(5);
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('HTTP 404: retry 3 lần, hiện lỗi và Thử lại khôi phục bảng', async ({ page }) => {
  let attempts = 0;
  await page.route('**/assets/data/customers.json', route => {
    attempts++;
    return route.fulfill({ status: 404, contentType: 'text/plain', body: 'Not Found' });
  });
  await page.goto('/customers');
  await expect(page.getByRole('alert')).toContainText('Không tải được danh sách khách hàng. HTTP 404.');
  expect(attempts).toBe(4);
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('table')).toHaveCount(0);
  await page.screenshot({ path: 'docs/customers-http-error.png', fullPage: true });
  await page.unroute('**/assets/data/customers.json');
  await page.getByRole('button', { name: 'Thử lại' }).click();
  await expect(page.locator('.customer-row')).toHaveCount(5);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('mất kết nối hiển thị lỗi an toàn', async ({ page }) => {
  await page.route('**/assets/data/customers.json', route => route.abort('failed'));
  await page.goto('/customers');
  await expect(page.getByRole('alert')).toContainText('Không thể kết nối đến máy chủ.');
  await expect(page.locator('.customer-row')).toHaveCount(0);
});

test('JSON sai cú pháp được đưa vào luồng xử lý lỗi', async ({ page }) => {
  await page.route('**/assets/data/customers.json', route => route.fulfill({
    status: 200, contentType: 'application/json', body: '[{"Customers":[],},]'
  }));
  await page.goto('/customers');
  await expect(page.getByRole('alert')).toContainText('Nội dung JSON không hợp lệ.');
  await expect(page.getByRole('status')).toHaveCount(0);
});
